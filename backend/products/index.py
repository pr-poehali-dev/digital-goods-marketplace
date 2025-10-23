import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
from decimal import Decimal

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get products list or single product, create/update products (admin)
    Args: event with httpMethod, queryStringParameters (category filter)
    Returns: HTTP response with products data
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            category = params.get('category')
            
            if category:
                cur.execute(
                    "SELECT id, name, category, description, price, discount, badge, stock, image_url FROM products WHERE category = %s AND is_active = TRUE ORDER BY created_at DESC",
                    (category,)
                )
            else:
                cur.execute(
                    "SELECT id, name, category, description, price, discount, badge, stock, image_url FROM products WHERE is_active = TRUE ORDER BY created_at DESC"
                )
            
            products = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(p) for p in products], cls=DecimalEncoder),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            cur.execute(
                '''INSERT INTO products (name, category, description, price, discount, badge, stock, product_key)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id''',
                (body['name'], body['category'], body.get('description'), body['price'],
                 body.get('discount', 0), body.get('badge'), body.get('stock', 0), body.get('product_key'))
            )
            product_id = cur.fetchone()['id']
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': product_id}, cls=DecimalEncoder),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()