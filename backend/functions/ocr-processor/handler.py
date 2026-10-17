
"""
Lambda Function: OCR Receipt Processor Service
Author: Le Trong Nghia (SV1 - 24110286)
Project: ExpenseTracker

Description:
    Triggered by Amazon S3 ObjectCreated events.
    Uses Amazon Textract AnalyzeExpense to extract receipt data,
    saves structured transactions to DynamoDB, and exports JSON
    records to the analytics S3 bucket.
"""

import json
import os
import uuid
import logging
import urllib.parse

from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation

import boto3
from botocore.exceptions import ClientError


# 1. Initialize AWS SDK Clients

AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")

s3_client = boto3.client("s3", region_name=AWS_REGION)
textract_client = boto3.client("textract", region_name=AWS_REGION)
dynamodb = boto3.resource("dynamodb", region_name=AWS_REGION)

TABLE_NAME = os.environ.get("TABLE_NAME", "Transactions")

ANALYTICS_BUCKET = os.environ.get(
    "ANALYTICS_BUCKET",
    "expense-analytics-data-24110286"
)

ANALYTICS_PREFIX = os.environ.get(
    "ANALYTICS_PREFIX",
    "transactions/"
)

table = dynamodb.Table(TABLE_NAME)

logger = logging.getLogger()
logger.setLevel(logging.INFO)


# 2. Normalize OCR Values

def normalize_amount(value):
    """Convert an OCR amount into Decimal for DynamoDB."""
    if value is None:
        return None

    text = str(value).strip()

    # Remove currency symbols and whitespace.
    text = "".join(
        char for char in text
        if char.isdigit() or char in ".,-"
    )

    if not text or not any(char.isdigit() for char in text):
        return None

    # Examples:
    # 1,250.50 -> 1250.50
    # 1.250,50 -> 1250.50
    if "," in text and "." in text:
        if text.rfind(".") > text.rfind(","):
            text = text.replace(",", "")
        else:
            text = text.replace(".", "").replace(",", ".")
    elif "," in text:
        parts = text.rsplit(",", 1)

        if len(parts[1]) in (1, 2):
            text = parts[0].replace(",", "") + "." + parts[1]
        else:
            text = text.replace(",", "")

    try:
        amount = Decimal(text)

        if not amount.is_finite():
            return None

        return amount

    except InvalidOperation:
        logger.warning("Unable to parse amount: %s", value)
        return None


def normalize_date(value):
    """Convert recognized receipt dates into YYYY-MM-DD."""
    if not value:
        return None

    value = str(value).strip()

    formats = [
        "%Y-%m-%d",
        "%d/%m/%Y",
        "%m/%d/%Y",
        "%d-%m-%Y",
        "%Y/%m/%d",
        "%d %b %Y",
        "%d %B %Y",
    ]

    for date_format in formats:
        try:
            return datetime.strptime(
                value, date_format
            ).date().isoformat()
        except ValueError:
            continue

    logger.warning("Unable to parse receipt date: %s", value)
    return None


# 3. Extract Expense Fields from Textract

def extract_expense_data(response):
    """Extract the required summary fields from Textract."""
    result = {
        "vendorName": None,
        "transactionDate": None,
        "totalAmount": None,
        "taxAmount": None,
    }

    field_mapping = {
        "VENDOR_NAME": "vendorName",
        "INVOICE_RECEIPT_DATE": "transactionDate",
        "TOTAL": "totalAmount",
        "TAX": "taxAmount",
    }

    for document in response.get("ExpenseDocuments", []):
        for field in document.get("SummaryFields", []):
            field_type = (
                field.get("Type", {}).get("Text", "").upper()
            )

            target = field_mapping.get(field_type)

            if not target:
                continue

            value = field.get("ValueDetection", {}).get("Text")

            if value and result[target] is None:
                result[target] = value.strip()

    result["transactionDate"] = normalize_date(
        result["transactionDate"]
    )
    result["totalAmount"] = normalize_amount(
        result["totalAmount"]
    )
    result["taxAmount"] = normalize_amount(
        result["taxAmount"]
    )

    return result


# 4. Identify the User Who Uploaded the Receipt

def get_user_id(bucket_name, object_key):
    """
    Resolve userId from S3 object metadata or key prefix.

    Supported examples:
        Metadata: user-id = abc123
        Key: users/abc123/receipts/receipt.jpg

    Adapt this function to the actual upload flow.
    """
    metadata = s3_client.head_object(
        Bucket=bucket_name,
        Key=object_key
    ).get("Metadata", {})

    user_id = metadata.get("user-id")

    if user_id:
        return user_id

    parts = object_key.split("/")

    if len(parts) >= 3 and parts[0] == "users":
        return parts[1]

    raise ValueError(
        "Cannot identify userId. Add S3 metadata 'user-id' "
        "or use the key prefix users/<userId>/..."
    )


# 5. Process One Receipt

def process_receipt(bucket_name, object_key):
    logger.info(
        "Processing receipt: s3://%s/%s",
        bucket_name,
        object_key
    )

    # 1. Identify the owner of the receipt.
    user_id = get_user_id(bucket_name, object_key)

    # 2. Call Amazon Textract AnalyzeExpense.
    response = textract_client.analyze_expense(
        Document={
            "S3Object": {
                "Bucket": bucket_name,
                "Name": object_key,
            }
        }
    )

    # 3. Extract and normalize the receipt fields.
    expense = extract_expense_data(response)

    if expense["totalAmount"] is None:
        raise ValueError(
            "Textract did not return a valid TOTAL amount."
        )

    # 4. Build the DynamoDB transaction.
    now = datetime.now(timezone.utc)
    transaction_id = (
        "TX#"
        + now.strftime("%Y-%m-%dT%H:%M:%S")
        + "#"
        + str(uuid.uuid4())
    )

    transaction = {
        "userId": user_id,
        "transactionId": transaction_id,
        "vendorName": expense["vendorName"] or "Unknown",
        "transactionDate": expense["transactionDate"],
        "totalAmount": expense["totalAmount"],
        "taxAmount": expense["taxAmount"],
        "sourceBucket": bucket_name,
        "sourceKey": object_key,
        "createdAt": now.isoformat(),
        "ocrStatus": "COMPLETED",
    }

    # DynamoDB does not accept None as an attribute value.
    transaction = {
        key: value
        for key, value in transaction.items()
        if value is not None
    }

    # 5. Save the transaction to DynamoDB.
    table.put_item(Item=transaction)

    logger.info(
        "Saved transaction %s for user %s",
        transaction_id,
        user_id
    )

    # 6. Export JSON to the analytics S3 bucket.
    # Store Decimal values as strings to preserve money precision.
    analytics_record = {
        key: str(value) if isinstance(value, Decimal) else value
        for key, value in transaction.items()
    }

    analytics_record["recordType"] = "receipt_transaction"

    output_key = (
        f"{ANALYTICS_PREFIX.rstrip('/')}/"
        f"{user_id}/"
        f"{transaction_id.replace('#', '_')}.json"
    )

    s3_client.put_object(
        Bucket=ANALYTICS_BUCKET,
        Key=output_key,
        Body=json.dumps(
            analytics_record,
            ensure_ascii=False
        ).encode("utf-8"),
        ContentType="application/json",
    )

    logger.info(
        "Exported analytics record to s3://%s/%s",
        ANALYTICS_BUCKET,
        output_key
    )

    return {
        "userId": user_id,
        "transactionId": transaction_id,
        "analyticsObject": f"s3://{ANALYTICS_BUCKET}/{output_key}",
        "ocrStatus": "COMPLETED",
    }


# 6. Lambda Handler


def lambda_handler(event: dict, context: object) -> dict:
    """Handle S3 ObjectCreated events."""
    logger.info("Received S3 Event: %s", json.dumps(event))

    records = event.get("Records", [])

    if not records:
        logger.warning("No records found in the event.")
        return {
            "statusCode": 200,
            "body": json.dumps({"message": "No records to process"}),
        }

    results = []

    try:
        for record in records:
            if record.get("eventSource") != "aws:s3":
                logger.info("Skipping non-S3 event.")
                continue

            s3_record = record.get("s3", {})
            bucket_name = s3_record.get("bucket", {}).get("name")
            encoded_key = s3_record.get("object", {}).get("key")

            if not bucket_name or not encoded_key:
                raise ValueError(
                    "Missing S3 bucket name or object key."
                )

            object_key = urllib.parse.unquote_plus(encoded_key)

            # Optional restriction to the receipt source bucket.
            expected_bucket = os.environ.get("RECEIPTS_BUCKET")

            if expected_bucket and bucket_name != expected_bucket:
                logger.info(
                    "Skipping unexpected bucket: %s",
                    bucket_name
                )
                continue

            # Ignore unsupported file types.
            if not object_key.lower().endswith(
                (".jpg", ".jpeg", ".png", ".pdf", ".tif", ".tiff")
            ):
                logger.info("Skipping unsupported file: %s", object_key)
                continue

            result = process_receipt(bucket_name, object_key)
            results.append(result)

        return {
            "statusCode": 200,
            "body": json.dumps(results, ensure_ascii=False),
        }

    except (ClientError, ValueError):
        logger.exception("Failed to process receipt event.")
        # Re-raise so asynchronous Lambda invocation can retry.
        raise

    except Exception:
        logger.exception("Unexpected OCR processor error.")
        raise
