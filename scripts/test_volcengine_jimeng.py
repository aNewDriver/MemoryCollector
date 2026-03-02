#!/usr/bin/env python3
"""
火山引擎即梦AI图像生成脚本
使用官方API调用方式
"""

import requests
import json
import hashlib
import hmac
import base64
import time
import uuid
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

# 角色配置（简化版，先测试一个）
TEST_CHARACTER = {
    "id": "jin_yu",
    "name": "烬羽",
    "prompt": "古风女战士，凤凰主题铠甲，火焰纹路，手持长刀，英姿飒爽，20岁，黑色长发带红色挑染，金色眼睛，赤红与黑色相间的轻甲，凤凰翅膀形状的肩甲，破损飘逸的披风，刀刃有熔岩般的纹路，眼神坚定而悲伤，侧身拔刀姿势，黄昏下燃烧的村庄废墟背景，空中漂浮着火星和灰烬，戏剧性金色时光照明，暖橙红色调为主，深邃黑色阴影，国风二次元风格，高精细节，电影感，概念艺术，全身像，动态构图",
    "negative": "低质量，模糊，水印，签名，最坏质量，畸形身体，现代服装"
}

def get_signature_key(key, date_stamp, region_name, service_name):
    """生成火山引擎API签名密钥"""
    k_date = hmac.new(("TLS" + key).encode('utf-8'), date_stamp.encode('utf-8'), hashlib.sha256).digest()
    k_region = hmac.new(k_date, region_name.encode('utf-8'), hashlib.sha256).digest()
    k_service = hmac.new(k_region, service_name.encode('utf-8'), hashlib.sha256).digest()
    k_signing = hmac.new(k_service, "request".encode('utf-8'), hashlib.sha256).digest()
    return k_signing

def sign_request(method, uri, query_string, headers, body, timestamp):
    """生成火山引擎API签名"""
    # 日期
    date_stamp = datetime.fromtimestamp(timestamp, tz=timezone.utc).strftime('%Y%m%d')
    
    # 创建规范请求
    canonical_headers = f"host:{HOST}\nx-date:{datetime.fromtimestamp(timestamp, tz=timezone.utc).strftime('%Y%m%dT%H%M%SZ')}\n"
    signed_headers = "host;x-date"
    
    payload_hash = hashlib.sha256(body.encode('utf-8')).hexdigest()
    
    canonical_request = f"{method}\n{uri}\n{query_string}\n{canonical_headers}\n{signed_headers}\n{payload_hash}"
    
    # 创建待签名字符串
    credential_scope = f"{date_stamp}/{REGION}/{SERVICE}/request"
    string_to_sign = f"HMAC-SHA256\n{datetime.fromtimestamp(timestamp, tz=timezone.utc).strftime('%Y%m%dT%H%M%SZ')}\n{credential_scope}\n{hashlib.sha256(canonical_request.encode('utf-8')).hexdigest()}"
    
    # 计算签名
    signing_key = get_signature_key(SECRET_ACCESS_KEY, date_stamp, REGION, SERVICE)
    signature = hmac.new(signing_key, string_to_sign.encode('utf-8'), hashlib.sha256).hexdigest()
    
    return signature

def generate_image(prompt, negative_prompt="", width=1024, height=1820):
    """调用即梦API生成图像"""
    
    timestamp = int(time.time())
    
    # 构建请求体
    request_body = {
        "req_key": "jimeng_t2i_v40",
        "req_json": json.dumps({
            "prompt": prompt,
            "negative_prompt": negative_prompt,
            "width": width,
            "height": height,
            "seed": int(time.time()) % 1000000,
            "watermark": False
        })
    }
    
    body = json.dumps(request_body)
    
    # 生成签名
    signature = sign_request("POST", "/", "", {}, body, timestamp)
    
    # 构建请求头
    date_stamp = datetime.fromtimestamp(timestamp, tz=timezone.utc).strftime('%Y%m%d')
    credential = f"{ACCESS_KEY_ID}/{date_stamp}/{REGION}/{SERVICE}/request"
    
    headers = {
        "Content-Type": "application/json",
        "Host": HOST,
        "X-Date": datetime.fromtimestamp(timestamp, tz=timezone.utc).strftime('%Y%m%dT%H%M%SZ'),
        "Authorization": f"HMAC-SHA256 Credential={credential}, SignedHeaders=host;x-date, Signature={signature}"
    }
    
    try:
        print(f"  发送请求到: {ENDPOINT}")
        print(f"  请求体: {body[:100]}...")
        
        response = requests.post(ENDPOINT, data=body, headers=headers, timeout=60)
        
        print(f"  状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"  响应: {json.dumps(result, indent=2, ensure_ascii=False)[:500]}")
            return result
        else:
            print(f"  错误响应: {response.text[:500]}")
            return None
            
    except Exception as e:
        print(f"  请求异常: {e}")
        return None

def main():
    print("🎨 火山引擎即梦AI图像生成测试")
    print("=" * 60)
    print(f"角色: {TEST_CHARACTER['name']}")
    print(f"提示词: {TEST_CHARACTER['prompt'][:50]}...")
    print("=" * 60)
    
    result = generate_image(
        TEST_CHARACTER['prompt'],
        TEST_CHARACTER['negative'],
        width=1024,
        height=1820
    )
    
    if result:
        print("\n✅ 请求成功!")
        if 'data' in result:
            print(f"任务ID: {result['data'].get('task_id', 'N/A')}")
            print("请使用任务ID查询生成结果")
    else:
        print("\n❌ 请求失败")
        print("\n可能的错误原因:")
        print("1. API密钥权限不足")
        print("2. 签名算法不正确")
        print("3. 服务未开通")
        print("4. 网络限制")

if __name__ == "__main__":
    main()
