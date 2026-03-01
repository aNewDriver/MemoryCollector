#!/usr/bin/env python3
"""
AI图像生成脚本 - 使用免费API生成角色立绘
支持: Pollinations.ai (免登录, 免费)
"""

import urllib.request
import urllib.parse
import json
import os
import sys
from pathlib import Path

# 输出目录
OUTPUT_DIR = Path(__file__).parent.parent.parent / "assets" / "resources" / "images" / "cards"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# 角色配置
CHARACTERS = [
    {
        "id": "jin_yu",
        "name": "烬羽",
        "element": "fire",
        "prompt": "female warrior, phoenix themed armor with flame patterns, elegant but fierce, 20yo, black hair with red highlights, golden eyes, crimson and black light armor, phoenix wing shoulder guards, flowing damaged cape, holding katana with lava-like patterns, determined and sorrowful expression, side stance ready to draw, burning village ruins at sunset, embers floating, dramatic golden hour lighting, warm orange-red dominant, deep black shadows, anime style, highly detailed, cinematic, concept art, full body, dynamic pose, vertical composition",
        "color": "golden red"
    },
    {
        "id": "qing_yi", 
        "name": "青漪",
        "element": "water",
        "prompt": "elegant female musician, flowing cyan dress, ancient guqin, ethereal beauty, water magic, 22yo, long cyan hair like waterfall, pearl hair ornaments, clear blue eyes, white silk upper garment, flowing sleeves, ankle bells, barefoot, serene and melancholic expression, kneeling playing guqin, bamboo forest at moonlight, mist and blue light particles, soft moonlight, cool blue tones, bioluminescent particles, chinese ink painting mixed with anime, ethereal, dreamy, full body seated pose",
        "color": "cyan blue"
    },
    {
        "id": "zhu_feng",
        "name": "逐风",
        "element": "wind",
        "prompt": "mysterious masked assassin, dark fitted outfit, dual short blades, wind effects, stealthy pose, black face mask covering lower face, sharp emerald green eyes, black short hair, dark green and black outfit, leather armor, multiple weapon pouches, fingerless gloves, bandaged arms, short cape, holding twin daggers with green glow, cold sharp killer eyes, crouching on building edge like hunting panther, ruined city in storm, wind and leaves swirling, dark storm clouds, dynamic composition",
        "color": "emerald green"
    },
    {
        "id": "yan_xin",
        "name": "岩心",
        "element": "earth",
        "prompt": "bulky armored knight, tower shield, earth armor, stalwart defender, 30yo, tall muscular build, short spiky hair, facial scars, determined eyes, full heavy rock-textured plate armor, mountain-shaped shoulder guards, earth gem on chest, removable face helmet, tattered brown cape, massive tower shield with crack patterns, one-handed war hammer, firm grounded stance, broken wall or mountain fortress background, dusty atmosphere, earthy tones, realistic anime, solid composition",
        "color": "brown gold"
    },
    {
        "id": "ming_zhu",
        "name": "明烛",
        "element": "light",
        "prompt": "holy priestess, golden light, white robes, divine staff, compassionate, 25yo, golden braided hair, golden crown, warm amber eyes, white and gold holy robes, sun embroidery, golden belt with cross, golden accessories, holding sacred staff with glowing lantern, kind and compassionate expression, gentle smile, standing or floating gracefully, radiant temple or cloud sanctuary, golden light rays, floating light particles, angelic symbols, warm divine atmosphere, divine fantasy art",
        "color": "golden white"
    },
    {
        "id": "can_ying",
        "name": "残影",
        "element": "dark",
        "prompt": "mysterious silhouette, memory fragments, void entity, fragmented reality, ethereal, slender form made of memory fragments, blue void glow between fragments, face obscured shadow, complex emotional eyes, translucent body showing glimpses of different scenes, shadow blades with blue light, mysterious pose reaching toward viewer, pure void or starry space background, distant nebula, floating memory fragments, dark blue and black, cyan highlights, abstract surreal, mysterious",
        "color": "dark blue purple"
    }
]

def generate_image_pollinations(prompt, width=1024, height=1820, seed=None):
    """
    使用 Pollinations.ai 免费API生成图像
    """
    # Pollinations.ai 是免费的,无需API密钥
    encoded_prompt = urllib.parse.quote(prompt)
    
    # 构建URL
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width={width}&height={height}&nologo=true"
    if seed:
        url += f"&seed={seed}"
    
    return url

def download_image(url, output_path):
    """
    下载图像到本地
    """
    try:
        print(f"  正在下载: {url[:80]}...")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.0'
        }
        req = urllib.request.Request(url, headers=headers)
        
        with urllib.request.urlopen(req, timeout=120) as response:
            with open(output_path, 'wb') as f:
                f.write(response.read())
        print(f"  ✓ 已保存: {output_path}")
        return True
    except Exception as e:
        print(f"  ✗ 下载失败: {e}")
        return False

def main():
    print("🎨 AI角色立绘生成工具")
    print("=" * 50)
    print(f"输出目录: {OUTPUT_DIR}")
    print()
    
    # 检查输出目录
    if not OUTPUT_DIR.exists():
        print(f"✗ 输出目录不存在: {OUTPUT_DIR}")
        sys.exit(1)
    
    generated_count = 0
    failed_count = 0
    
    for char in CHARACTERS:
        print(f"\n生成角色: {char['name']} ({char['element']})")
        print("-" * 40)
        
        # 生成全身立绘 (1024x1820)
        full_path = OUTPUT_DIR / f"{char['id']}_full_ai.png"
        if not full_path.exists():
            print(f"  生成全身立绘...")
            url = generate_image_pollinations(char['prompt'], 1024, 1820, seed=hash(char['id']) % 1000000)
            if download_image(url, full_path):
                generated_count += 1
            else:
                failed_count += 1
        else:
            print(f"  ⏭ 已存在: {full_path.name}")
        
        # 生成头像版本 (512x512)
        portrait_path = OUTPUT_DIR / f"{char['id']}_portrait_ai.png"
        if not portrait_path.exists():
            print(f"  生成头像...")
            portrait_prompt = char['prompt'].replace("full body", "portrait, close-up, face focus")
            url = generate_image_pollinations(portrait_prompt, 512, 512, seed=hash(char['id'] + "portrait") % 1000000)
            if download_image(url, portrait_path):
                generated_count += 1
            else:
                failed_count += 1
        else:
            print(f"  ⏭ 已存在: {portrait_path.name}")
    
    print("\n" + "=" * 50)
    print(f"✓ 生成完成: {generated_count} 张")
    if failed_count > 0:
        print(f"✗ 失败: {failed_count} 张")
    print(f"\n输出位置: {OUTPUT_DIR}")
    print("\n注意: 这些是AI生成的临时图片，建议:")
    print("1. 检查图片质量，选择最佳结果")
    print("2. 使用Upscayl等工具放大图片")
    print("3. 最终替换为专业美术资源")

if __name__ == "__main__":
    main()
