#!/usr/bin/env python3
"""
尝试不同的Action和版本组合
"""

import json
import requests
import hashlib
import hmac
import base64
from datetime import datetime, timezone

ACCESS_KEY_ID = "AKLTMTYxNDdmZWM5YTEzNDBlMWE2ZGU2YTE4NjZhNDIxZTc"
SECRET_ACCESS_KEY_RAW = "WmpVME1qUm1OV1ZpTW1Kak5ESmxaamxpWXpFME9ESm1aREkxTlRFNE16Yw=="

SECRET_ACCESS_KEY = base64.b64decode(SECRET_ACCESS_KEY_RAW).decode('utf-8')

def sha256_hash(data):
    return hashlib.sha256(data.encode('utf-8')).hexdigest()

def get_signature_key(secret_key, date_stamp, region, service):
    k_date = hmac.new(('TLS' + secret_key).encode('utf-8'), date_stamp.encode('utf-8'), hashlib.sha256).digest()
    k_region = hmac.new(k_date, region.encode('utf-8'), hashlib.sha256).digest()
    k_service = hmac.new(k_region, service.encode('utf-8'), hashlib.sha256).digest()
    k_signing = hmac.new(k_service, 'request'.encode('utf-8'), hashlib.sha256).digest()
    return k_signing

def test_api(action, version, service='cv', region='cn-north-1'):
    now = datetime.now(timezone.utc)
    amz_date = now.strftime('%Y%m%dT%H%M%SZ')
    date_stamp = now.strftime('%Y%m%d')
    
    host = "open.volcengineapi.com"
    uri = "/"
    query_string = f"Action={action}&Version={version}"
    
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
    
    # 签名
    canonical_headers = f"host:{host}\nx-date:{amz_date}\n"
    signed_headers = "host;x-date"
    payload_hash = sha256_hash(payload)
    canonical_request = f"POST\n{uri}\n{query_string}\n{canonical_headers}\n{signed_headers}\n{payload_hash}"
    
    algorithm = 'HMAC-SHA256'
    credential_scope = f"{date_stamp}/{region}/{service}/request"
    string_to_sign = f"{algorithm}\n{amz_date}\n{credential_scope}\n{sha256_hash(canonical_request)}"
    
    signing_key = get_signature_key(SECRET_ACCESS_KEY, date_stamp, region, service)
    signature = hmac.new(signing_key, string_to_sign.encode('utf-8'), hashlib.sha256).hexdigest()
    
    auth = f"{algorithm} Credential={ACCESS_KEY_ID}/{credential_scope}, SignedHeaders={signed_headers}, Signature={signature}"
    
    headers = {
        'Content-Type': 'application/json',
        'host': host,
        'x-date': amz_date,
        'authorization': auth
    }
    
    url = f"https://{host}{uri}?{query_string}"
    
    try:
        response = requests.post(url, data=payload, headers=headers, timeout=30)
        return response.status_code, response.text[:300]
    except Exception as e:
        return -1, str(e)

# 测试不同的组合
combinations = [
    ("SubmitTask", "2022-08-31", "cv"),
    ("SubmitTask", "2024-01-01", "cv"),
    ("SubmitTask", "2023-01-01", "cv"),
    ("CreateTask", "2022-08-31", "cv"),
    ("GenerateImage", "2022-08-31", "cv"),
    ("Text2Image", "2022-08-31", "cv"),
    ("SubmitTask", "2022-08-31", "jimeng"),
    ("SubmitTask", "2022-08-31", "maas"),
]

print("🔍 测试不同的API组合...\n")

for action, version, service in combinations:
    print(f"测试: Action={action}, Version={version}, Service={service}")
    status, result = test_api(action, version, service)
    print(f"  状态: {status}")
    if 'InvalidCredential' not in result and 'Auth' not in result:
        print(f"  响应: {result}")
        if status == 200:
            print(f"  ✅ 成功！")
            break
    print()
