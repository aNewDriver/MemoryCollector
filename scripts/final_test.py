#!/usr/bin/env python3
"""
最终尝试 - 使用API Explorer方式
"""

import json
import time
import requests
import hashlib
import hmac
import base64
from datetime import datetime, timezone

# API配置
ACCESS_KEY_ID = "AKLTMTYxNDdmZWM5YTEzNDBlMWE2ZGU2YTE4NjZhNDIxZTc"
# 尝试原始Base64密钥
SECRET_ACCESS_KEY_RAW = "WmpVME1qUm1OV1ZpTW1Kak5ESmxaamxpWXpFME9ESm1aREkxTlRFNE16Yw=="

# 解码密钥
try:
    SECRET_ACCESS_KEY = base64.b64decode(SECRET_ACCESS_KEY_RAW).decode('utf-8')
except:
    SECRET_ACCESS_KEY = SECRET_ACCESS_KEY_RAW

print(f"使用的SecretAccessKey: {SECRET_ACCESS_KEY[:20]}...")

# 手动实现签名
def sha256_hash(data):
    return hashlib.sha256(data.encode('utf-8')).hexdigest()

def get_signature_key(secret_key, date_stamp, region, service):
    k_date = hmac.new(('TLS' + secret_key).encode('utf-8'), date_stamp.encode('utf-8'), hashlib.sha256).digest()
    k_region = hmac.new(k_date, region.encode('utf-8'), hashlib.sha256).digest()
    k_service = hmac.new(k_region, service.encode('utf-8'), hashlib.sha256).digest()
    k_signing = hmac.new(k_service, 'request'.encode('utf-8'), hashlib.sha256).digest()
    return k_signing

def sign_request(method, uri, query_string, headers, payload, access_key, secret_key, region, service):
    now = datetime.now(timezone.utc)
    amz_date = now.strftime('%Y%m%dT%H%M%SZ')
    date_stamp = now.strftime('%Y%m%d')
    
    # 规范Headers
    canonical_headers = f"host:{headers['host']}\nx-date:{amz_date}\n"
    signed_headers = "host;x-date"
    
    payload_hash = sha256_hash(payload)
    
    canonical_request = f"{method}\n{uri}\n{query_string}\n{canonical_headers}\n{signed_headers}\n{payload_hash}"
    
    # 待签名字符串
    algorithm = 'HMAC-SHA256'
    credential_scope = f"{date_stamp}/{region}/{service}/request"
    string_to_sign = f"{algorithm}\n{amz_date}\n{credential_scope}\n{sha256_hash(canonical_request)}"
    
    # 签名
    signing_key = get_signature_key(secret_key, date_stamp, region, service)
    signature = hmac.new(signing_key, string_to_sign.encode('utf-8'), hashlib.sha256).hexdigest()
    
    auth_header = f"{algorithm} Credential={access_key}/{credential_scope}, SignedHeaders={signed_headers}, Signature={signature}"
    
    return auth_header, amz_date

# 测试请求
host = "open.volcengineapi.com"
uri = "/"
query_string = "Action=SubmitTask&Version=2022-08-31"

body_dict = {
    "req_key": "jimeng_t2i_v40",
    "req_json": json.dumps({
        "prompt": "古风女战士，凤凰铠甲",
        "width": 1024,
        "height": 1820,
        "return_url": True
    }, ensure_ascii=False)
}

payload = json.dumps(body_dict, ensure_ascii=False)

headers = {'host': host}
auth, amz_date = sign_request('POST', uri, query_string, headers, payload, ACCESS_KEY_ID, SECRET_ACCESS_KEY, 'cn-north-1', 'cv')

request_headers = {
    'Content-Type': 'application/json',
    'host': host,
    'x-date': amz_date,
    'authorization': auth
}

url = f"https://{host}{uri}?{query_string}"

print(f"\n请求URL: {url}")
print(f"Authorization: {auth[:80]}...")

response = requests.post(url, data=payload, headers=request_headers, timeout=30)
print(f"\n状态码: {response.status_code}")
print(f"响应: {response.text[:500]}")

if response.status_code == 400 and 'InvalidCredential' in response.text:
    print("\n❌ 认证失败 - 密钥问题")
    print("\n可能原因:")
    print("1. 密钥未开通即梦AI服务权限")
    print("2. 密钥已过期")
    print("3. 需要在控制台先开通即梦服务")
    print("\n建议操作:")
    print("1. 登录 https://console.volcengine.com/")
    print("2. 搜索'即梦AI'并开通服务")
    print("3. 创建新的API密钥（专门用于即梦）")
    print("4. 或使用网页版: https://jimeng.jianying.com")
