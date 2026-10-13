"""
Lambda Function: Transactions CRUD Service
Author: Nguyen Thanh Thang (SV2 - 24110332)
Project: ExpenseTracker
Description:
    Skeleton handler for managing personal expense transactions in DynamoDB.
    Supports API Gateway RESTful endpoints: GET, POST, PUT, DELETE.
"""

import json
import os
import boto3
from datetime import datetime
from decimal import Decimal

# Initialize DynamoDB Client
dynamodb = boto3.resource('dynamodb', region_name=os.environ.get('AWS_REGION', 'us-east-1'))
TABLE_NAME = os.environ.get('TABLE_NAME', 'Transactions')
table = dynamodb.Table(TABLE_NAME)

# Standard CORS and JSON Headers
HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
}


def build_response(status_code: int, body: dict) -> dict:
    """Helper function to build API Gateway compliant HTTP response."""
    return {
        'statusCode': status_code,
        'headers': HEADERS,
        'body': json.dumps(body, default=str)
    }


def lambda_handler(event: dict, context: any) -> dict:
    """
    Main Lambda entrypoint triggered by Amazon API Gateway.
    Routes requests according to HTTP Method and Resource Path.
    """
    print(f"Incoming Event: {json.dumps(event)}")
    http_method = event.get('httpMethod', '')
    path_parameters = event.get('pathParameters') or {}
    query_parameters = event.get('queryStringParameters') or {}

    try:
        # Route: OPTIONS (CORS preflight)
        if http_method == 'OPTIONS':
            return build_response(200, {'message': 'CORS preflight OK'})

        # Route: GET /transactions or GET /transactions/{id}
        if http_method == 'GET':
            transaction_id = path_parameters.get('id')
            if transaction_id:
                return get_transaction(query_parameters.get('userId', 'user_default'), transaction_id)
            return list_transactions(query_parameters.get('userId', 'user_default'), query_parameters.get('month'))

        # Route: POST /transactions
        elif http_method == 'POST':
            body = json.loads(event.get('body', '{}'))
            return create_transaction(body)

        # Route: PUT /transactions/{id}
        elif http_method == 'PUT':
            transaction_id = path_parameters.get('id')
            body = json.loads(event.get('body', '{}'))
            return update_transaction(transaction_id, body)

        # Route: DELETE /transactions/{id}
        elif http_method == 'DELETE':
            transaction_id = path_parameters.get('id')
            return delete_transaction(query_parameters.get('userId', 'user_default'), transaction_id)

        else:
            return build_response(400, {'error': f"Unsupported HTTP method: {http_method}"})

    except Exception as e:
        print(f"Internal Server Error: {str(e)}")
        return build_response(500, {'error': 'Internal server error', 'details': str(e)})


def list_transactions(user_id: str, month: str = None) -> dict:
    """Query transactions belonging to user_id, optionally filtered by month prefix."""
    # Week 2 implementation will execute dynamodb Query with KeyConditionExpression
    return build_response(200, {
        'message': f"List transactions skeleton for user {user_id}",
        'count': 0,
        'items': []
    })


def get_transaction(user_id: str, transaction_id: str) -> dict:
    """Fetch single transaction by Composite Primary Key (userId, transactionId)."""
    return build_response(200, {
        'message': f"Get transaction {transaction_id} skeleton",
        'item': None
    })


def create_transaction(payload: dict) -> dict:
    """Create new transaction record in DynamoDB with format TX#YYYY-MM-DDTHH:mm:ss#<uuid>."""
    if not payload.get('amount') or not payload.get('category'):
        return build_response(400, {'error': 'Missing required fields: amount, category'})

    return build_response(201, {
        'message': 'Transaction created successfully (skeleton)',
        'data': payload
    })


def update_transaction(transaction_id: str, payload: dict) -> dict:
    """Update existing transaction attributes."""
    return build_response(200, {
        'message': f"Transaction {transaction_id} updated successfully (skeleton)",
        'data': payload
    })


def delete_transaction(user_id: str, transaction_id: str) -> dict:
    """Delete transaction from DynamoDB."""
    return build_response(200, {
        'message': f"Transaction {transaction_id} deleted successfully (skeleton)"
    })
