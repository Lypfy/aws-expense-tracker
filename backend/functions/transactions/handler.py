"""
Lambda Function: Transactions CRUD Service
Author: Nguyen Thanh Thang (SV2 - 24110332)
Project: ExpenseTracker
Description:
    AWS Lambda handler providing RESTful CRUD API endpoints for managing
    personal transactions in Amazon DynamoDB ('Transactions' table).
    Integrated with Amazon API Gateway (Lambda Proxy Integration) with CORS support.
    
    Optimizations (Week 2):
    - URL-Safe Sort Key: Uses 'TX_YYYY-MM-DDTHH:mm:ss_<uuid>' with underscore '_'
      to prevent URL hashtag (#) fragmentation issues in HTTP clients.
    - Automatic URL-Decoding: Automatically decodes URL-encoded parameters (e.g. %23 -> #)
      to seamlessly support legacy IDs with '#' passed in path parameters.
    - Anti-Upsert Protection: Uses ConditionExpression='attribute_exists(transactionId)'
      to ensure PUT/DELETE return 404 Not Found if the transaction does not exist.
"""

import json
import os
import uuid
import urllib.parse
from datetime import datetime
from decimal import Decimal
import boto3
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError

# Initialize DynamoDB Resource
REGION = os.environ.get('AWS_REGION', 'us-east-1')
TABLE_NAME = os.environ.get('TABLE_NAME', 'Transactions')
dynamodb = boto3.resource('dynamodb', region_name=REGION)
table = dynamodb.Table(TABLE_NAME)

# Standard CORS Headers
CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE',
    'Content-Type': 'application/json'
}


class DecimalEncoder(json.JSONEncoder):
    """Helper class to convert DynamoDB Decimal types to standard int/float for JSON serialization."""
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj) if obj % 1 == 0 else float(obj)
        return super(DecimalEncoder, self).default(obj)


def build_response(status_code: int, body: any) -> dict:
    """Builds a standard API Gateway proxy response with CORS headers."""
    return {
        'statusCode': status_code,
        'headers': CORS_HEADERS,
        'body': json.dumps(body, cls=DecimalEncoder, ensure_ascii=False)
    }


def lambda_handler(event: dict, context: any) -> dict:
    """
    Main entrypoint handling API Gateway Proxy Integration events.
    Routes HTTP requests based on httpMethod and resource/path.
    """
    print(f"Incoming Event: {json.dumps(event, default=str)}")

    http_method = event.get('httpMethod') or event.get('requestContext', {}).get('http', {}).get('method', '')
    path = event.get('resource') or event.get('rawPath', '')
    raw_path_params = event.get('pathParameters') or {}
    query_params = event.get('queryStringParameters') or {}

    # Automatically unquote/decode URL encoded path parameters (e.g. %23 -> #)
    path_parameters = {
        k: urllib.parse.unquote(v) if isinstance(v, str) else v
        for k, v in raw_path_params.items()
    }

    # Handle CORS Preflight request
    if http_method == 'OPTIONS':
        return build_response(200, {'message': 'CORS preflight successful'})

    try:
        # Route 1: POST /transactions (Create a new transaction)
        if http_method == 'POST' and (path.endswith('/transactions') or path == '/transactions'):
            return handle_create_transaction(event)

        # Route 2: GET /transactions (List or Query transactions by userId & optional month)
        elif http_method == 'GET' and (path.endswith('/transactions') or path == '/transactions'):
            return handle_list_transactions(query_params)

        # Route 3: GET /transactions/{id} (Get a specific transaction by id)
        elif http_method == 'GET' and ('{id}' in path or path_parameters.get('id')):
            return handle_get_transaction(path_parameters, query_params)

        # Route 4: PUT /transactions/{id} (Update a transaction)
        elif http_method == 'PUT' and ('{id}' in path or path_parameters.get('id')):
            return handle_update_transaction(event, path_parameters, query_params)

        # Route 5: DELETE /transactions/{id} (Delete a transaction)
        elif http_method == 'DELETE' and ('{id}' in path or path_parameters.get('id')):
            return handle_delete_transaction(path_parameters, query_params)

        # Unsupported Route
        else:
            return build_response(400, {
                'error': f"Unsupported method '{http_method}' on path '{path}'"
            })

    except Exception as e:
        print(f"Unhandled Exception: {str(e)}")
        return build_response(500, {
            'error': 'Internal Server Error',
            'details': str(e)
        })


def handle_create_transaction(event: dict) -> dict:
    """Creates a new transaction item in DynamoDB."""
    body_str = event.get('body')
    if not body_str:
        return build_response(400, {'error': 'Missing request body'})

    try:
        body = json.loads(body_str, parse_float=Decimal)
    except Exception:
        return build_response(400, {'error': 'Invalid JSON format in body'})

    # Mandatory field validation
    user_id = body.get('userId')
    amount = body.get('amount')
    category = body.get('category')

    if not user_id:
        return build_response(400, {'error': "Field 'userId' is required"})
    if amount is None or Decimal(str(amount)) <= 0:
        return build_response(400, {'error': "Field 'amount' must be a positive number"})
    if not category:
        return build_response(400, {'error': "Field 'category' is required"})

    # Determine or generate createdAt and transactionId (Sort Key)
    now_iso = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
    created_at = body.get('createdAt', now_iso)
    
    # Sort Key convention: TX_<ISO_TIMESTAMP>_<SHORT_UUID> (URL-Safe with underscore)
    # If caller provided transactionId, use it; otherwise generate unique URL-safe ID
    transaction_id = body.get('transactionId')
    if not transaction_id:
        time_part = created_at.replace('Z', '')
        short_id = uuid.uuid4().hex[:8]
        transaction_id = f"TX_{time_part}_{short_id}"

    # Build DynamoDB Item
    item = {
        'userId': user_id,
        'transactionId': transaction_id,
        'amount': Decimal(str(amount)),
        'currency': body.get('currency', 'VND'),
        'category': category,
        'type': body.get('type', 'EXPENSE'),
        'merchant': body.get('merchant', ''),
        'description': body.get('description', ''),
        'createdAt': created_at,
        'updatedAt': now_iso
    }

    if 'receiptUrl' in body:
        item['receiptUrl'] = body['receiptUrl']

    table.put_item(Item=item)

    return build_response(201, {
        'message': 'Transaction created successfully',
        'data': item
    })


def handle_list_transactions(query_params: dict) -> dict:
    """
    Retrieves transactions for a given userId.
    Supports optional month filtering via 'month=YYYY-MM'.
    """
    user_id = query_params.get('userId')
    if not user_id:
        return build_response(400, {
            'error': "Query parameter 'userId' is required (e.g. ?userId=user_01)"
        })

    month = query_params.get('month')  # format: '2026-10'

    if month:
        # Sort Key begins with prefix 'TX_' (or legacy 'TX#')
        sk_prefix = f"TX_{month}"
        response = table.query(
            KeyConditionExpression=Key('userId').eq(user_id) & Key('transactionId').begins_with(sk_prefix)
        )
        items = response.get('Items', [])
        
        # If no items found with TX_, also check legacy TX# format
        if not items:
            legacy_prefix = f"TX#{month}"
            legacy_resp = table.query(
                KeyConditionExpression=Key('userId').eq(user_id) & Key('transactionId').begins_with(legacy_prefix)
            )
            items = legacy_resp.get('Items', [])
    else:
        # Query all transactions belonging to userId
        response = table.query(
            KeyConditionExpression=Key('userId').eq(user_id)
        )
        items = response.get('Items', [])

    return build_response(200, {
        'userId': user_id,
        'filterMonth': month,
        'count': len(items),
        'items': items
    })


def handle_get_transaction(path_params: dict, query_params: dict) -> dict:
    """Gets a specific transaction item by userId and transactionId."""
    transaction_id = path_params.get('id')
    user_id = query_params.get('userId')

    if not transaction_id:
        return build_response(400, {'error': 'Missing transaction id in path'})
    if not user_id:
        return build_response(400, {'error': "Query parameter 'userId' is required"})

    response = table.get_item(
        Key={
            'userId': user_id,
            'transactionId': transaction_id
        }
    )

    item = response.get('Item')
    if not item:
        return build_response(404, {
            'error': f"Transaction '{transaction_id}' not found for user '{user_id}'"
        })

    return build_response(200, {
        'message': 'Transaction found',
        'data': item
    })


def handle_update_transaction(event: dict, path_params: dict, query_params: dict) -> dict:
    """
    Updates fields of an existing transaction item.
    Enforces ConditionExpression='attribute_exists(transactionId)' to prevent accidental upsert.
    """
    transaction_id = path_params.get('id')
    body_str = event.get('body')
    if not body_str:
        return build_response(400, {'error': 'Missing request body'})

    try:
        body = json.loads(body_str, parse_float=Decimal)
    except Exception:
        return build_response(400, {'error': 'Invalid JSON format in body'})

    user_id = body.get('userId') or query_params.get('userId')
    if not user_id:
        return build_response(400, {'error': "Field 'userId' is required"})
    if not transaction_id:
        return build_response(400, {'error': 'Missing transaction id in path'})

    # Dynamically build UpdateExpression for allowed mutable fields
    updatable_fields = ['amount', 'category', 'currency', 'type', 'merchant', 'description', 'receiptUrl']
    update_parts = []
    expr_attr_values = {}
    expr_attr_names = {}

    for field in updatable_fields:
        if field in body:
            val = Decimal(str(body[field])) if field == 'amount' else body[field]
            alias = f"#{field}"
            val_placeholder = f":{field}"
            update_parts.append(f"{alias} = {val_placeholder}")
            expr_attr_names[alias] = field
            expr_attr_values[val_placeholder] = val

    if not update_parts:
        return build_response(400, {'error': 'No valid fields provided for update'})

    # Add updatedAt timestamp
    now_iso = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
    update_parts.append("#updatedAt = :updatedAt")
    expr_attr_names["#updatedAt"] = "updatedAt"
    expr_attr_values[":updatedAt"] = now_iso

    update_expression = "SET " + ", ".join(update_parts)

    try:
        # ConditionExpression ensures item exists before updating (Anti-Upsert)
        response = table.update_item(
            Key={
                'userId': user_id,
                'transactionId': transaction_id
            },
            UpdateExpression=update_expression,
            ConditionExpression="attribute_exists(transactionId)",
            ExpressionAttributeNames=expr_attr_names,
            ExpressionAttributeValues=expr_attr_values,
            ReturnValues='ALL_NEW'
        )
        return build_response(200, {
            'message': 'Transaction updated successfully',
            'data': response.get('Attributes')
        })
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            return build_response(404, {
                'error': f"Transaction '{transaction_id}' not found for user '{user_id}'. Cannot update non-existent record."
            })
        return build_response(500, {'error': f"Failed to update transaction: {str(e)}"})
    except Exception as e:
        return build_response(500, {'error': f"Failed to update transaction: {str(e)}"})


def handle_delete_transaction(path_params: dict, query_params: dict) -> dict:
    """
    Deletes a transaction item by userId and transactionId.
    Enforces ConditionExpression='attribute_exists(transactionId)' to return 404 if item does not exist.
    """
    transaction_id = path_params.get('id')
    user_id = query_params.get('userId')

    if not transaction_id:
        return build_response(400, {'error': 'Missing transaction id in path'})
    if not user_id:
        return build_response(400, {'error': "Query parameter 'userId' is required"})

    try:
        table.delete_item(
            Key={
                'userId': user_id,
                'transactionId': transaction_id
            },
            ConditionExpression="attribute_exists(transactionId)"
        )
        return build_response(200, {
            'message': f"Transaction '{transaction_id}' deleted successfully",
            'transactionId': transaction_id,
            'userId': user_id
        })
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            return build_response(404, {
                'error': f"Transaction '{transaction_id}' not found for user '{user_id}'. Cannot delete non-existent record."
            })
        return build_response(500, {'error': f"Failed to delete transaction: {str(e)}"})
