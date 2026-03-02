#!/usr/bin/env python3
"""
使用OpenAPI SDK调用即梦AI - 修正版
"""

import json
import time
import requests
from pathlib import Path

# 火山引擎SDK
from volcengine.auth.SignerV4 import SignerV4
from volcengine.base.Request import Request
from volcengine.Credentials import Credentials

# API配置
ACCESS_KEY_ID = "AKLTMTYxNDdmZWM5YTEzNDBlMWE2ZGU2YTE4NjZhNDIxZTc"
SECRET_ACCESS_KEY = "WmpVME1qUm1OV1ZpTW1Kak5ESmxaamxpWXpFME9ESm1aREkxTlRFNE16Yw=="

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

def submit_jimeng_task(prompt, negative_prompt="", width=1024, height=1820):
    """提交即梦图像生成任务"""
    
    # 创建凭证
    credentials = Credentials(ACCESS_KEY_ID, SECRET_ACCESS_KEY, "cn-north-1", "cv")
    
    # 创建请求
    request = Request()
    request.set_method("POST")
    request.set_host("open.volcengineapi.com")
    request.set_path("/")
    request.set_query({
        "Action": "SubmitTask",
        "Version": "2022-08-31"
    })
    
    # 设置请求体
    body = {
        "req_key": "jimeng_t2i_v40",
        "req_json": json.dumps({
            "prompt": prompt,
            "negative_prompt": negative_prompt,
            "width": width,
            "height": height,
            "seed": int(time.time()) % 1000000,
            "watermark": False
        }, ensure_ascii=False)
    }
    request.set_body(json.dumps(body, ensure_ascii=False))
    
    # 签名
    SignerV4.sign(request, credentials)
    
    # 发送请求
    url = f"https://{request.host}{request.path}?Action=SubmitTask&Version=2022-08-31"
    headers = {
        'Content-Type': 'application/json',
        'host': request.host,
        'x-date': request.headers.get('x-date'),
        'authorization': request.headers.get('authorization')
    }
    
    try:
        print(f"  请求URL: {url[:60]}...")
        response = requests.post(url, data=request.body, headers=headers, timeout=60)
        
        print(f"  状态码: {response.status_code}")
        
        if response.status_code == 200:
            return response.json()
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
    
    result = submit_jimeng_task(char['prompt'], char['negative'], 1024, 1820)
    
    if result:
        print("\n✅ 请求成功!")
        print(f"响应: {json.dumps(result, indent=2, ensure_ascii=False)[:800]}")
        
        # 检查是否有任务ID
        if 'Result' in result or 'result' in result:
            task_data = result.get('Result') or result.get('result')
            if task_data:
                task_id = task_data.get('TaskId') or task_data.get('task_id')
                if task_id:
                    print(f"\n📝 任务ID: {task_id}")
                    print("图像生成任务已提交，请稍后查询结果")
    else:
        print("\n❌ 请求失败")
        print("\n可能的原因:")
        print("1. API密钥权限不足或未开通即梦服务")
        print("2. 签名算法问题")
        print("3. 服务地区/版本不匹配")
        print("\n建议:")
        print("- 登录火山引擎控制台确认即梦服务已开通")
        print("- 检查API密钥权限")

if __name__ == "__main__":
    main()
