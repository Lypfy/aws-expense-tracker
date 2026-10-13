"""
Lambda Function: OCR Receipt Processor Service
Author: Le Trong Nghia (SV1 - 24110286)
Project: ExpenseTracker
Description:
    Skeleton handler triggered by Amazon S3 ObjectCreated events.
    Sends raw invoice image/PDF to Amazon Textract (AnalyzeExpense API)
    and saves structured expense data to DynamoDB.
"""

import json
import os
import urllib.parse
import boto3

# Initialize AWS SDK Clients
s3_client = boto3.client('s3')
textract_client = boto3.client('textract', region_name=os.environ.get('AWS_REGION', 'us-east-1'))
dynamodb = boto3.resource('dynamodb', region_name=os.environ.get('AWS_REGION', 'us-east-1'))
TABLE_NAME = os.environ.get('TABLE_NAME', 'Transactions')


def lambda_handler(event: dict, context: any) -> dict:
    """
    Main Lambda entrypoint triggered by Amazon S3 PutObject notification.
    """
    print(f"Received S3 Event: {json.dumps(event)}")

    try:
        # 1. Parse Bucket Name and Object Key from S3 Event
        record = event['Records'][0]
        bucket_name = record['s3']['bucket']['name']
        object_key = urllib.parse.unquote_plus(record['s3']['object']['key'])

        print(f"Processing receipt from S3: s3://{bucket_name}/{object_key}")

        # 2. Call Amazon Textract AnalyzeExpense API (Skeleton call)
        # Week 2 implementation will execute:
        # response = textract_client.analyze_expense(
        #     Document={'S3Object': {'Bucket': bucket_name, 'Name': object_key}}
        # )

        extracted_data = {
            'bucket': bucket_name,
            'objectKey': object_key,
            'vendorName': 'Sample Merchant (Skeleton)',
            'totalAmount': '0.00',
            'transactionDate': '2026-10-13',
            'status': 'PENDING_WEEK2_INTEGRATION'
        }

        print(f"Extracted Expense Data (Skeleton): {extracted_data}")

        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'S3 Receipt processed successfully (skeleton)',
                'data': extracted_data
            })
        }

    except Exception as e:
        print(f"Error processing S3 receipt event: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
