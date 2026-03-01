#!/usr/bin/env python3
"""
AI图像生成脚本 - 备选方案
使用Hugging Face或其他免费服务
"""

import urllib.request
import urllib.parse
import json
import os
import sys
import time
from pathlib import Path

# 输出目录
OUTPUT_DIR = Path(__file__).parent.parent.parent / "assets" / "resources" / "images" / "cards"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# 尝试使用Hugging Face Inference API (免费,无需密钥)
HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"

def generate_with_huggingface(prompt, width=1024, height=1024):
    """
    使用Hugging Face免费API生成图像
    """
    payload = {
        "inputs": prompt,
        "parameters": {
            "width": width,
            "height": height,
            "guidance_scale": 7.5,
            "num_inference_steps": 50
        }
    }
    
    data = json.dumps(payload).encode('utf-8')
    
    headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
    }
    
    req = urllib.request.Request(HF_API_URL, data=data, headers=headers, method='POST')
    
    try:
        with urllib.request.urlopen(req, timeout=300) as response:
            # Hugging Face返回的是图像二进制数据
            return response.read()
    except Exception as e:
        print(f"  API错误: {e}")
        return None

def main():
    print("🎨 AI角色立绘生成工具 (Hugging Face版本)")
    print("=" * 50)
    print(f"输出目录: {OUTPUT_DIR}")
    print()
    print("⚠️ 注意: 由于网络限制，自动API调用可能失败。")
    print("推荐做法:")
    print("1. 打开 docs/ai_generation/ai_generator.html")
    print("2. 复制Prompt到 Midjourney/Stable Diffusion WebUI")
    print("3. 手动下载生成的图片到项目目录")
    print()
    print("或者使用本地Stable Diffusion:")
    print("- 启动本地SD WebUI")
    print("- 导入 batch_generation.json")
    print("- 批量生成所有角色")
    print()
    
    # 显示Prompt预览
    print("=" * 50)
    print("角色Prompt预览:")
    print("=" * 50)
    
    import json
    config_path = Path(__file__).parent.parent.parent / "docs" / "Character_Art_Prompts.json"
    with open(config_path) as f:
        config = json.load(f)
    
    for char in config['characters']:
        print(f"\n🎭 {char['name']} ({char['title']}) - {char['element']}")
        print(f"   Prompt (前100字): {char['prompts']['stableDiffusion']['normal'][:100]}...")
        print(f"   输出文件: {char['id']}_full.png, {char['id']}_awaken.png, {char['id']}_portrait.png")
    
    print("\n" + "=" * 50)
    print(f"\n请使用 docs/ai_generation/ai_generator.html 进行生成")
    print("浏览器打开后可以直接复制Prompt到剪贴板")

if __name__ == "__main__":
    main()
