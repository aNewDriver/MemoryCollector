#!/usr/bin/env python3
"""
火山引擎即梦AI图像生成脚本 - 修正版
添加了Action参数和正确的API路径
"""

import requests
import json
import hashlib
import hmac
import base64
import time
import urllib.parse
from pathlib import Path
from datetime import datetime, timezone

# API配置 - 用户提供的密钥
ACCESS_KEY_ID = "AKLTMTYxNDdmZWM5YTEzNDBlMWE2ZGU2YTE4NjZhNDIxZTc"
SECRET_ACCESS_KEY = "WmpVME1qUm1OV1ZpTW1Kak5ESmxaamxpWXpFME9ESm1aREkxTlRFNE16Yw=="

# 常量
REGION = "cn-north-1"
SERVICE = "cv"
HOST = "open.volcengineapi.com"
ENDPOINT = f"https://{HOST}"

# 输出目录
OUTPUT_DIR = Path(__file__).parent.parent.parent / "assets" / "resources" / "images" / "cards"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# 角色配置
CHARACTERS = [
    {
        "id": "jin_yu",
        "name": "烬羽",
        "prompt": "古风女战士，凤凰主题铠甲，火焰纹路，手持长刀，英姿飒爽，20岁，黑色长发带红色挑染，金色眼睛，赤红与黑色相间的轻甲，凤凰翅膀形状的肩甲，破损飘逸的披风，刀刃有熔岩般的纹路，眼神坚定而悲伤，侧身拔刀姿势，黄昏下燃烧的村庄废墟背景，空中漂浮着火星和灰烬，戏剧性金色时光照明，暖橙红色调为主，深邃黑色阴影，国风二次元风格，高精细节，电影感，概念艺术，全身像，动态构图",
        "negative": "低质量，模糊，水印，签名，最坏质量，畸形身体，现代服装"
    }
]

def sha256_hash(data):
    """计算SHA256哈希"""
    return hashlib.sha256(data.encode('utf-8')).hexdigest()

def get_signature_key(secret_key, date_stamp, region_name, service_name):
    """生成签名密钥"""
    k_date = hmac.new(('TLS' + secret_key).encode('utf-8'), date_stamp.encode('utf-8'), hashlib.sha256).digest()
    k_region = hmac.new(k_date, region_name.encode('utf-8'), hashlib.sha256).digest()
    k_service = hmac.new(k_region, service_name.encode('utf-8'), hashlib.sha256).digest()
    k_signing = hmac.new(k_service, 'request'.encode('utf-8'), hashlib.sha256).digest()
    return k_signing

def sign_request_v4(method, uri, query_string, headers, payload, access_key, secret_key, region, service):
    """AWS Signature Version 4 签名"""
    now = datetime.now(timezone.utc)
    amz_date = now.strftime('%Y%m%dT%H%M%SZ')
    date_stamp = now.strftime('%Y%m%d')
    
    # 步骤1: 创建规范请求
    if not headers.get('host'):
        headers['host'] = HOST
    
    # 规范Headers
    canonical_headers = ''
    signed_headers = ''
    for key in sorted(headers.keys()):
        canonical_headers += key.lower() + ':' + headers[key].strip() + '\n'
        signed_headers += key.lower() + ';'
    signed_headers = signed_headers[:-1]  # 去掉最后一个分号
    
    payload_hash = sha256_hash(payload)
    
    canonical_request = f"{method}\n{uri}\n{query_string}\n{canonical_headers}\n{signed_headers}\n{payload_hash}"
    
    # 步骤2: 创建待签名字符串
    algorithm = 'HMAC-SHA256'
    credential_scope = f"{date_stamp}/{region}/{service}/request"
    string_to_sign = f"{algorithm}\n{amz_date}\n{credential_scope}\n{sha256_hash(canonical_request)}"
    
    # 步骤3: 计算签名
    signing_key = get_signature_key(secret_key, date_stamp, region, service)
    signature = hmac.new(signing_key, string_to_sign.encode('utf-8'), hashlib.sha256).hexdigest()
    
    # 步骤4: 添加签名到Authorization头
    authorization_header = f"{algorithm} Credential={access_key}/{credential_scope}, SignedHeaders={signed_headers}, Signature={signature}"
    
    return authorization_header, amz_date

def submit_task(prompt, negative_prompt="", width=1024, height=1820):
    """提交图像生成任务"""
    
    # 构建请求体
    req_json = {
        "prompt": prompt,
        "negative_prompt": negative_prompt,
        "width": width,
        "height": height,
        "seed": int(time.time()) % 1000000,
        "watermark": False
    }
    
    request_body = {
        "req_key": "jimeng_t2i_v40",
        "req_json": json.dumps(req_json, ensure_ascii=False)
    }
    
    payload = json.dumps(request_body, ensure_ascii=False)
    
    # 查询参数 - 添加Action和Version
    action = "SubmitTask"
    version = "2022-08-31"
    
    query_params = {
        "Action": action,
        "Version": version
    }
    query_string = urllib.parse.urlencode(query_params)
    
    # 构建请求头
    headers = {
        'Content-Type': 'application/json',
        'host': HOST,
    }
    
    # 生成签名
    auth_header, amz_date = sign_request_v4(
        'POST', '/', query_string, headers, payload,
        ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION, SERVICE
    )
    
    headers['X-Date'] = amz_date
    headers['Authorization'] = auth_header
    
    # 构建完整URL
    url = f"{ENDPOINT}/?{query_string}"
    
    try:
        print(f"  请求URL: {url[:80]}...")
        print(f"  请求体: {payload[:100]}...")
        
        response = requests.post(url, data=payload.encode('utf-8'), headers=headers, timeout=60)
        
        print(f"  状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"  响应: {json.dumps(result, indent=2, ensure_ascii=False)[:800]}")
            return result
        else:
            print(f"  错误: {response.text[:500]}")
            return None
            
    except Exception as e:
        print(f"  异常: {e}")
        return None

def main():
    print("🎨 火山引擎即梦AI图像生成")
    print("=" * 60)
    
    char = CHARACTERS[0]
    print(f"\n🎭 角色: {char['name']}")
    print(f"提示词: {char['prompt'][:50]}...")
    print("-" * 60)
    
    result = submit_task(char['prompt'], char['negative'], 1024, 1820)
    
    if result:
        print("\n✅ 请求成功!")
        if 'Result' in result or 'result' in result:
            task_data = result.get('Result') or result.get('result')
            if task_data:
                task_id = task_data.get('TaskId') or task_data.get('task_id')
                print(f"任务ID: {task_id}")
                print("图像生成任务已提交，请稍后查询结果")
    else:
        print("\n❌ 请求失败，请检查:")
        print("1. API密钥是否正确")
        print("2. 即梦服务是否已开通")
        print("3. 签名算法是否正确")

if __name__ == "__main__":
    main()
