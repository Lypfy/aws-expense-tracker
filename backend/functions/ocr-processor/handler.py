"""
Lambda Function: OCR Receipt Processor Service
Author: Le Trong Nghia (SV1 - 24110286)
Project: ExpenseTracker

Description:
    Triggered by Amazon S3 ObjectCreated events.
    Uses Amazon Textract AnalyzeExpense to extract receipt data,
    saves structured transactions to DynamoDB (matching group schema),
    and exports JSON records to the analytics S3 bucket for AWS Glue & Athena.

Optimizations & Improvements:
    - URL-Safe Sort Key: Uses 'TX_YYYY-MM-DDTHH:mm:ss_<short_uuid>' with '_' instead of '#'
      to prevent URL hashtag (#) fragmentation issues in web browsers and CRUD APIs.
    - Unified Schema Integration: Populates both standard API fields ('amount', 'merchant',
      'category', 'type', 'currency', 'receiptUrl') and OCR metadata ('vendorName', 'totalAmount',
      'transactionDate', 'taxAmount') for 100% interoperability with CRUD API.
    - Intelligent Categorization: Automatically detects category (Food & Dining, Groceries, etc.)
      from vendor name to enable Athena analytics aggregation ('GROUP BY category').
    - Robust User Identification: Graceful fallback chain (S3 metadata -> key prefix -> default)
      preventing Lambda crashes during direct AWS S3 Console uploads.
    - Analytics Numeric Typing: Exports money amounts as numeric floats in S3 JSON so Glue Crawler
      infers 'double' type, enabling direct SUM() and AVG() queries in Amazon Athena.
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
DEFAULT_USER_ID = os.environ.get("DEFAULT_USER_ID", "user_01")

ANALYTICS_BUCKET = os.environ.get(
    "ANALYTICS_BUCKET",
    "expense-analytics-data-24110286"
)
ANALYTICS_PREFIX = os.environ.get("ANALYTICS_PREFIX", "transactions/")

table = dynamodb.Table(TABLE_NAME)

logger = logging.getLogger()
logger.setLevel(logging.INFO)


# 2. Normalize OCR Values & Intelligent Categorization
def normalize_amount(value):
    """Convert an OCR amount into Decimal for DynamoDB."""
    if value is None:
        return None

    text = str(value).strip()

    # Remove currency symbols and whitespace
    text = "".join(char for char in text if char.isdigit() or char in ".,-")

    if not text or not any(char.isdigit() for char in text):
        return None

    # Handle comma/dot decimal separators (e.g., 1,250.50 or 1.250,50)
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
    """Convert recognized receipt dates into ISO YYYY-MM-DD."""
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
            return datetime.strptime(value, date_format).date().isoformat()
        except ValueError:
            continue

    logger.warning("Unable to parse receipt date: %s", value)
    return None


def infer_category(vendor_name: str) -> str:
    """
    Intelligently infer expense category from merchant/vendor name.
    Feeds directly into Athena 'GROUP BY category' analytics.
    """
    if not vendor_name:
        return "General"

    v = vendor_name.lower()

    food_keywords = [
        "nhà hàng", "quán", "phở", "bún", "cơm", "cà phê", "cafe", "coffee",
        "trà", "tea", "bakery", "bánh", "pizza", "kfc", "lotteria", "jollibee",
        "highlands", "starbucks", "mcdonald", "sushi", "lẩu", "nướng", "bbq",
        "food", "restaurant", "dining", "bar", "pub", "ẩm thực", "quán ăn"
    ]
    grocery_keywords = [
        "siêu thị", "mart", "market", "co.op", "coop", "winmart", "bách hóa",
        "circle k", "ministop", "7-eleven", "familymart", "gs25", "grocery", "an nam"
    ]
    transport_keywords = [
        "xăng", "petrol", "petrolimex", "pvoil", "grab", "be", "gojek", "taxi",
        "mai linh", "vinataxi", "xanh sm", "vé xe", "vé tàu", "flight", "airline"
    ]
    health_keywords = [
        "nhà thuốc", "pharmacy", "pharmacity", "long châu", "an khang",
        "bệnh viện", "phòng khám", "clinic", "hospital", "bác sĩ", "thuốc"
    ]
    shopping_keywords = [
        "shopee", "tiki", "lazada", "sendo", "thời trang", "boutique", "fashion",
        "zara", "uniqlo", "h&m", "quần áo", "giày", "điện máy", "fpt", "tgdd"
    ]
    utilities_keywords = [
        "điện lực", "cấp nước", "internet", "viettel", "mobifone", "vinaphone", "fpt telecom"
    ]

    for kw in food_keywords:
        if kw in v:
            return "Food & Dining"
    for kw in grocery_keywords:
        if kw in v:
            return "Groceries"
    for kw in transport_keywords:
        if kw in v:
            return "Transportation"
    for kw in health_keywords:
        if kw in v:
            return "Healthcare"
    for kw in shopping_keywords:
        if kw in v:
            return "Shopping"
    for kw in utilities_keywords:
        if kw in v:
            return "Utilities"

    return "General"


# 3. Extract Expense Fields from Textract
def extract_expense_data(response):
    """Extract the required summary fields from Textract AnalyzeExpense."""
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
            field_type = field.get("Type", {}).get("Text", "").upper()
            target = field_mapping.get(field_type)

            if not target:
                continue

            value = field.get("ValueDetection", {}).get("Text")
            if value and result[target] is None:
                result[target] = value.strip()

    result["transactionDate"] = normalize_date(result["transactionDate"])
    result["totalAmount"] = normalize_amount(result["totalAmount"])
    result["taxAmount"] = normalize_amount(result["taxAmount"])

    return result


# 4. Identify the User Who Uploaded the Receipt
def get_user_id(bucket_name, object_key):
    """
    Resolve userId with robust fallback chain:
    1. S3 Object Metadata ('user-id' or 'userid')
    2. Key prefix: users/<userId>/receipts/...
    3. Fallback default: DEFAULT_USER_ID ('user_01')
    """
    try:
        metadata = s3_client.head_object(
            Bucket=bucket_name,
            Key=object_key
        ).get("Metadata", {})

        user_id = metadata.get("user-id") or metadata.get("userid")
        if user_id:
            return user_id.strip()

        parts = object_key.split("/")
        if len(parts) >= 3 and parts[0] == "users":
            return parts[1]

    except Exception as e:
        logger.warning("Could not read S3 metadata for key %s: %s", object_key, str(e))

    # Graceful fallback instead of raising fatal exception
    logger.info("Using default userId '%s' for receipt: %s", DEFAULT_USER_ID, object_key)
    return DEFAULT_USER_ID


# 5. Process One Receipt
def process_receipt(bucket_name, object_key):
    logger.info("Processing receipt: s3://%s/%s", bucket_name, object_key)

    # 1. Identify the owner of the receipt
    user_id = get_user_id(bucket_name, object_key)

    # 2. Call Amazon Textract AnalyzeExpense
    response = textract_client.analyze_expense(
        Document={
            "S3Object": {
                "Bucket": bucket_name,
                "Name": object_key,
            }
        }
    )

    # 3. Extract and normalize receipt fields
    expense = extract_expense_data(response)
    if expense["totalAmount"] is None:
        raise ValueError("Textract did not return a valid TOTAL amount from receipt.")

    # 4. Build URL-Safe Sort Key: TX_YYYY-MM-DDTHH:mm:ss_<short_uuid>
    now = datetime.now(timezone.utc)
    now_iso = now.strftime("%Y-%m-%dT%H:%M:%SZ")
    time_part = now.strftime("%Y-%m-%dT%H:%M:%S")
    short_uuid = str(uuid.uuid4())[:8]
    transaction_id = f"TX_{time_part}_{short_uuid}"

    vendor = expense["vendorName"] or "Unknown Merchant"
    category = infer_category(vendor)
    receipt_url = f"s3://{bucket_name}/{object_key}"

    # 5. Build Standard DynamoDB Item (matching 100% project schema)
    transaction = {
        "userId": user_id,
        "transactionId": transaction_id,
        "amount": expense["totalAmount"],
        "currency": "VND",
        "category": category,
        "type": "EXPENSE",
        "merchant": vendor,
        "description": f"Hóa đơn {vendor} (OCR Textract)",
        "receiptUrl": receipt_url,
        "createdAt": expense["transactionDate"] or now_iso,
        "updatedAt": now_iso,
        "taxAmount": expense["taxAmount"],
        "ocrStatus": "COMPLETED"
    }

    # DynamoDB does not accept None as attribute value
    dynamo_item = {k: v for k, v in transaction.items() if v is not None}

    # 6. Save the transaction to DynamoDB
    table.put_item(Item=dynamo_item)
    logger.info(
        "Saved transaction %s for user %s (Amount: %s, Category: %s)",
        transaction_id,
        user_id,
        expense["totalAmount"],
        category
    )

    # 7. Export JSON to Analytics S3 Bucket
    # Convert Decimals to float numbers so AWS Glue Crawler infers 'double' for Athena SQL queries
    analytics_record = {}
    for key, value in dynamo_item.items():
        if isinstance(value, Decimal):
            analytics_record[key] = float(value)
        else:
            analytics_record[key] = value

    analytics_record["recordType"] = "receipt_transaction"

    output_key = f"{ANALYTICS_PREFIX.rstrip('/')}/{user_id}/{transaction_id}.json"

    s3_client.put_object(
        Bucket=ANALYTICS_BUCKET,
        Key=output_key,
        Body=json.dumps(analytics_record, ensure_ascii=False, indent=2).encode("utf-8"),
        ContentType="application/json",
    )
    logger.info("Exported analytics record to s3://%s/%s", ANALYTICS_BUCKET, output_key)

    return {
        "userId": user_id,
        "transactionId": transaction_id,
        "amount": float(expense["totalAmount"]),
        "vendorName": vendor,
        "category": category,
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
                raise ValueError("Missing S3 bucket name or object key.")

            object_key = urllib.parse.unquote_plus(encoded_key)

            # Optional restriction to the receipt source bucket
            expected_bucket = os.environ.get("RECEIPTS_BUCKET")
            if expected_bucket and bucket_name != expected_bucket:
                logger.info("Skipping unexpected bucket: %s", bucket_name)
                continue

            # Ignore unsupported file types
            if not object_key.lower().endswith((".jpg", ".jpeg", ".png", ".pdf", ".tif", ".tiff")):
                logger.info("Skipping unsupported file: %s", object_key)
                continue

            result = process_receipt(bucket_name, object_key)
            results.append(result)

        return {
            "statusCode": 200,
            "body": json.dumps(results, ensure_ascii=False),
        }

    except Exception as e:
        logger.exception("OCR processor error: %s", str(e))
        raise
