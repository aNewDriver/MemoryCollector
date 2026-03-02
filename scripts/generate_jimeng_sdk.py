#!/usr/bin/env python3
"""
使用OpenAPI SDK调用即梦AI
推荐方式：使用火山引擎官方SDK
"""

import json
import time
from pathlib import Path

# 检查是否安装了volcengine SDK
try:
    from volcengine.auth.SignerV4 import SignerV4
    from volcengine.base.Request import Request
    from volcengine.Credentials import Credentials
    SDK_AVAILABLE = True
except ImportError:
    SDK_AVAILABLE = False
    print("⚠️ 未安装火山引擎SDK")

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
    },
    {
        "id": "qing_yi",
        "name": "青漪",
        "prompt": "优雅的女琴师，飘逸的青色长裙，怀抱古琴，空灵绝美的气质，水系魔法，22岁，青色长发如瀑布，珍珠发饰，清澈蓝眼，白色丝绸上衣，宽大飘逸袖子，脚系银铃，赤足，宁静忧伤的表情，跪坐抚琴姿势，月光下的竹林背景，薄雾缭绕，蓝色光点漂浮，柔和月光，清冷蓝调，生物发光粒子，中国水墨画融合二次元风格，空灵梦幻，全身坐姿构图",
        "negative": "暖色调，鲜艳色彩，攻击性姿势，现代服装"
    }
]

def generate_with_sdk():
    """使用SDK生成图像"""
    if not SDK_AVAILABLE:
        print("❌ SDK未安装，无法使用此方法")
        return None
    
    # 构建凭证
    credentials = Credentials(ACCESS_KEY_ID, SECRET_ACCESS_KEY, "cn-north-1", "cv")
    
    # 构建请求
    request = Request()
    request.set_method("POST")
    request.set_host("open.volcengineapi.com")
    request.set_path("/")
    request.set_query({
        "Action": "SubmitTask",
        "Version": "2022-08-31"
    })
    
    # 请求体
    body = {
        "req_key": "jimeng_t2i_v40",
        "req_json": json.dumps({
            "prompt": CHARACTERS[0]["prompt"],
            "negative_prompt": CHARACTERS[0]["negative"],
            "width": 1024,
            "height": 1820,
            "seed": int(time.time()) % 1000000
        }, ensure_ascii=False)
    }
    
    request.set_body(json.dumps(body, ensure_ascii=False))
    
    # 签名
    SignerV4.sign(request, credentials)
    
    print(f"请求已签名，准备发送...")
    
    # 获取签名后的headers
    headers = {
        'Content-Type': 'application/json',
        'host': request.get_host(),
        'x-date': request.get_header('x-date'),
        'authorization': request.get_header('authorization')
    }
    
    print(f"Headers: {headers}")
    
    return request, headers

def install_sdk_instructions():
    """打印SDK安装说明"""
    print("\n📦 安装火山引擎SDK")
    print("=" * 60)
    print("方法一（推荐）:")
    print("  pip install volcengine")
    print("\n方法二（从源码）:")
    print("  git clone https://github.com/volcengine/volc-sdk-python")
    print("  cd volc-sdk-python")
    print("  pip install .")
    print("\n安装后重新运行此脚本")
    print("=" * 60)

def manual_api_instructions():
    """打印手动调用API的指南"""
    print("\n📖 手动调用即梦API指南")
    print("=" * 60)
    print("由于API端点和Action参数需要查阅官方文档，")
    print("建议通过以下方式获取准确的API信息：")
    print()
    print("1. 登录火山引擎控制台")
    print("   https://console.volcengine.com/")
    print()
    print("2. 进入即梦AI服务页面")
    print("   产品与服务 → AI与机器学习 → 即梦AI")
    print()
    print("3. 查看API Explorer获取准确的：")
    print("   - Action名称")
    print("   - 请求路径")
    print("   - 参数格式")
    print()
    print("4. 或者使用SDK方式调用（推荐）")
    print("=" * 60)
    
    print("\n🎨 已生成的Prompt文件：")
    print(f"  - docs/ai_generation/chinese_prompts.md")
    print(f"  - docs/ai_generation/jimeng_kling_guide.md")
    print()
    print("你可以直接使用这些Prompt在即梦网页版生成：")
    print("  https://jimeng.jianying.com")

def main():
    print("🎨 火山引擎即梦AI图像生成")
    print("=" * 60)
    
    if SDK_AVAILABLE:
        print("✅ 火山引擎SDK已安装")
        print("\n尝试使用SDK调用API...")
        request, headers = generate_with_sdk()
        if request:
            print("\n✅ 请求已签名")
            print(f"目标: https://{request.get_host()}{request.get_path()}")
            print("\n现在需要发送HTTP请求...")
            
            # 发送请求
            import requests
            url = f"https://{request.get_host()}{request.get_path()}?Action=SubmitTask&Version=2022-08-31"
            try:
                response = requests.post(url, data=request.get_body(), headers=headers, timeout=60)
                print(f"\n状态码: {response.status_code}")
                print(f"响应: {response.text[:800]}")
            except Exception as e:
                print(f"\n请求失败: {e}")
    else:
        print("❌ 火山引擎SDK未安装")
        install_sdk_instructions()
        manual_api_instructions()

if __name__ == "__main__":
    main()
