#!/usr/bin/env python3
"""
即梦AI图像生成 - 使用解码后的密钥
"""

import json
import time
import requests
from pathlib import Path

# 火山引擎SDK
from volcengine.auth.SignerV4 import SignerV4
from volcengine.base.Request import Request
from volcengine.Credentials import Credentials

# API配置 - 使用解码后的密钥
ACCESS_KEY_ID = "AKLTMTYxNDdmZWM5YTEzNDBlMWE2ZGU2YTE4NjZhNDIxZTc"
SECRET_ACCESS_KEY = "f5424f5eb2bc42ef9bc1482fd2551837"  # 解码后的密钥

# 输出目录
OUTPUT_DIR = Path(__file__).parent.parent.parent / "assets" / "resources" / "images" / "cards"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# 角色配置 - 只测试烬羽
CHARACTER = {
    "id": "jin_yu",
    "name": "烬羽",
    "prompt": "古风女战士，凤凰主题铠甲，火焰纹路，手持长刀，英姿飒爽，20岁，黑色长发带红色挑染，金色眼睛，赤红与黑色相间的轻甲，凤凰翅膀形状的肩甲，破损飘逸的披风，刀刃有熔岩般的纹路，眼神坚定而悲伤，侧身拔刀姿势，黄昏下燃烧的村庄废墟背景，空中漂浮着火星和灰烬，戏剧性金色时光照明，暖橙红色调为主，深邃黑色阴影，国风二次元风格，高精细节，电影感，概念艺术，全身像，动态构图",
    "negative": "低质量，模糊，水印，签名，最坏质量，畸形身体，现代服装"
}

def call_api(action, version, body_dict):
    """调用火山引擎API"""
    credentials = Credentials(ACCESS_KEY_ID, SECRET_ACCESS_KEY, "cn-north-1", "cv")
    
    request = Request()
    request.set_method("POST")
    request.set_host("open.volcengineapi.com")
    request.set_path("/")
    request.set_query({"Action": action, "Version": version})
    request.set_body(json.dumps(body_dict, ensure_ascii=False))
    
    SignerV4.sign(request, credentials)
    
    url = f"https://{request.host}{request.path}?Action={action}&Version={version}"
    headers = {
        'Content-Type': 'application/json',
        'host': request.host,
        'x-date': request.headers.get('x-date'),
        'authorization': request.headers.get('authorization')
    }
    
    try:
        response = requests.post(url, data=request.body, headers=headers, timeout=60)
        return response.status_code, response.json() if response.status_code == 200 else response.text
    except Exception as e:
        return -1, str(e)

def main():
    print("🎨 即梦AI测试 - 使用解码后的密钥")
    print("=" * 60)
    print(f"AccessKeyID: {ACCESS_KEY_ID[:20]}...")
    print(f"SecretAccessKey: {SECRET_ACCESS_KEY[:10]}...")
    print("=" * 60)
    
    # 构建请求
    req_json = {
        "prompt": CHARACTER["prompt"],
        "negative_prompt": CHARACTER["negative"],
        "width": 1024,
        "height": 1820,
        "return_url": True
    }
    
    body = {
        "req_key": "jimeng_t2i_v40",
        "req_json": json.dumps(req_json, ensure_ascii=False)
    }
    
    print(f"\n角色: {CHARACTER['name']}")
    print(f"Prompt: {CHARACTER['prompt'][:50]}...")
    print("\n发送请求...")
    
    status, result = call_api("SubmitTask", "2022-08-31", body)
    
    print(f"\n状态码: {status}")
    print(f"响应: {json.dumps(result, indent=2, ensure_ascii=False) if isinstance(result, dict) else result[:500]}")

if __name__ == "__main__":
    main()
