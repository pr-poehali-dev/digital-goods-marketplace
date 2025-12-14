import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import hashlib
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from typing import Dict, Any
from decimal import Decimal

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    return secrets.token_urlsafe(32)

def send_verification_email(email: str, token: str, smtp_config: dict):
    verification_link = f"https://apkeys.poehali.dev/verify?token={token}"
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = 'Подтверждение email - APKEYS'
    msg['From'] = smtp_config['user']
    msg['To'] = email
    
    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #0ea5e9 100%); padding: 30px; text-align: center; border-radius: 10px;">
          <h1 style="color: white; margin: 0;">⚡ APKEYS</h1>
        </div>
        <div style="padding: 30px; background: #f5f5f5; border-radius: 10px; margin-top: 20px;">
          <h2 style="color: #333;">Подтвердите ваш email</h2>
          <p style="color: #666; font-size: 16px;">Спасибо за регистрацию! Нажмите на кнопку ниже, чтобы подтвердить ваш email:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{verification_link}" style="background: linear-gradient(135deg, #8b5cf6 0%, #0ea5e9 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Подтвердить email
            </a>
          </div>
          <p style="color: #999; font-size: 14px;">Или скопируйте эту ссылку:</p>
          <p style="background: white; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px; color: #666;">{verification_link}</p>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">Ссылка действительна 24 часа. Если вы не регистрировались на APKEYS, просто проигнорируйте это письмо.</p>
        </div>
      </body>
    </html>
    """
    
    html_part = MIMEText(html_content, 'html')
    msg.attach(html_part)
    
    server = smtplib.SMTP(smtp_config['host'], smtp_config['port'])
    server.starttls()
    server.login(smtp_config['user'], smtp_config['password'])
    server.send_message(msg)
    server.quit()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: User authentication, registration and email verification
    Args: event with httpMethod, body (email, password, full_name for register), queryStringParameters (token for verification)
    Returns: HTTP response with user data or error
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
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            token = params.get('token', '')
            
            if not token:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Token required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "SELECT id, email_verified, verification_expires FROM t_p95675566_digital_goods_market.users WHERE verification_token = %s",
                (token,)
            )
            result = cur.fetchone()
            
            if not result:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid token'}),
                    'isBase64Encoded': False
                }
            
            user_id = result['id']
            already_verified = result['email_verified']
            expires_at = result['verification_expires']
            
            if already_verified:
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'message': 'Email already verified', 'verified': True}),
                    'isBase64Encoded': False
                }
            
            if expires_at and datetime.now() > expires_at:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Token expired'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "UPDATE t_p95675566_digital_goods_market.users SET email_verified = TRUE, verification_token = NULL WHERE id = %s",
                (user_id,)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Email verified successfully', 'verified': True}),
                'isBase64Encoded': False
            }
        
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'register':
                email = body.get('email')
                password = body.get('password')
                full_name = body.get('full_name', '')
                
                password_hash = hash_password(password)
                verification_token = generate_token()
                verification_expires = datetime.now() + timedelta(hours=24)
                
                cur.execute(
                    "INSERT INTO t_p95675566_digital_goods_market.users (email, password_hash, full_name, email_verified, verification_token, verification_expires) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id, email, full_name, is_admin, balance, email_verified",
                    (email, password_hash, full_name, False, verification_token, verification_expires)
                )
                user = cur.fetchone()
                conn.commit()
                
                smtp_config = {
                    'host': os.environ.get('SMTP_HOST'),
                    'port': int(os.environ.get('SMTP_PORT', '587')),
                    'user': os.environ.get('SMTP_USER'),
                    'password': os.environ.get('SMTP_PASSWORD')
                }
                
                if all(smtp_config.values()):
                    try:
                        send_verification_email(email, verification_token, smtp_config)
                    except Exception as e:
                        pass
                
                token = generate_token()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'user': dict(user),
                        'token': token,
                        'message': 'Письмо с подтверждением отправлено на ваш email'
                    }, cls=DecimalEncoder),
                    'isBase64Encoded': False
                }
            
            elif action == 'login':
                email = body.get('email')
                password = body.get('password')
                password_hash = hash_password(password)
                
                cur.execute(
                    "SELECT id, email, full_name, is_admin, balance, email_verified FROM t_p95675566_digital_goods_market.users WHERE email = %s AND password_hash = %s",
                    (email, password_hash)
                )
                user = cur.fetchone()
                
                if not user:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Invalid credentials'}),
                        'isBase64Encoded': False
                    }
                
                token = generate_token()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'user': dict(user),
                        'token': token
                    }, cls=DecimalEncoder),
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
