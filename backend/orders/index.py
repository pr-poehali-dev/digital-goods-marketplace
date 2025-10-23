import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
from decimal import Decimal
import datetime

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()
        return super(DecimalEncoder, self).default(obj)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Create orders, get user orders history
    Args: event with httpMethod, body (user_id, items for create)
    Returns: HTTP response with order data
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            items = body.get('items', [])
            
            total = sum(item['price'] * item.get('quantity', 1) for item in items)
            
            cur.execute(
                "INSERT INTO orders (user_id, total_amount, status) VALUES (%s, %s, %s) RETURNING id",
                (user_id, total, 'completed')
            )
            order_id = cur.fetchone()['id']
            
            for item in items:
                cur.execute(
                    "SELECT product_key FROM products WHERE id = %s AND stock > 0 LIMIT 1",
                    (item['product_id'],)
                )
                product = cur.fetchone()
                
                if product:
                    cur.execute(
                        '''INSERT INTO order_items (order_id, product_id, product_name, price, quantity, product_key)
                           VALUES (%s, %s, %s, %s, %s, %s)''',
                        (order_id, item['product_id'], item['name'], item['price'], 
                         item.get('quantity', 1), product['product_key'])
                    )
                    
                    cur.execute(
                        "UPDATE products SET stock = stock - 1 WHERE id = %s",
                        (item['product_id'],)
                    )
            
            conn.commit()
            
            cur.execute(
                '''SELECT oi.product_name, oi.price, oi.product_key 
                   FROM order_items oi WHERE oi.order_id = %s''',
                (order_id,)
            )
            order_items = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'order_id': order_id,
                    'total': float(total),
                    'items': [dict(item) for item in order_items]
                }, cls=DecimalEncoder),
                'isBase64Encoded': False
            }
        
        elif method == 'GET':
            params = event.get('queryStringParameters') or {}
            user_id = params.get('user_id')
            
            if user_id:
                cur.execute(
                    '''SELECT o.id, o.total_amount, o.status, o.created_at,
                       json_agg(json_build_object('name', oi.product_name, 'price', oi.price, 'key', oi.product_key)) as items
                       FROM orders o
                       LEFT JOIN order_items oi ON o.id = oi.order_id
                       WHERE o.user_id = %s
                       GROUP BY o.id
                       ORDER BY o.created_at DESC''',
                    (user_id,)
                )
                orders = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(order) for order in orders], cls=DecimalEncoder),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Bad request'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()