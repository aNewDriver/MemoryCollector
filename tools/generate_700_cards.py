#!/usr/bin/env python3
"""
记忆回收者 - 700张卡牌占位图生成器
使用PIL批量生成卡牌占位资源
"""

from PIL import Image, ImageDraw, ImageFont
import os
import json

BASE_DIR = "/root/.openclaw/workspace/projects/memory-collector/assets/images/cards"
os.makedirs(BASE_DIR, exist_ok=True)

# 元素颜色
ELEMENT_COLORS = {
    "metal": (200, 200, 220),  # 金 - 银白
    "wood": (50, 150, 80),     # 木 - 翠绿
    "water": (50, 100, 200),   # 水 - 深蓝
    "fire": (200, 80, 50),     # 火 - 红橙
    "earth": (150, 120, 80),   # 土 - 棕黄
    "light": (255, 220, 150),  # 光 - 金黄
    "dark": (80, 50, 100),     # 暗 - 紫黑
}

# 稀有度颜色
RARITY_COLORS = {
    "N": (150, 150, 150),   # 普通 - 灰
    "R": (50, 150, 255),    # 稀有 - 蓝
    "SR": (200, 50, 200),   # 史诗 - 紫
    "SSR": (255, 200, 50),  # 传说 - 金
    "UR": (255, 50, 50),    # 神话 - 红
}

# 700张卡牌配置
# 按元素和稀有度分配
CARD_CONFIG = {
    "metal": {"N": 30, "R": 20, "SR": 10, "SSR": 5, "UR": 2},
    "wood": {"N": 30, "R": 20, "SR": 10, "SSR": 5, "UR": 2},
    "water": {"N": 30, "R": 20, "SR": 10, "SSR": 5, "UR": 2},
    "fire": {"N": 30, "R": 20, "SR": 10, "SSR": 5, "UR": 2},
    "earth": {"N": 30, "R": 20, "SR": 10, "SSR": 5, "UR": 2},
    "light": {"N": 15, "R": 10, "SR": 5, "SSR": 3, "UR": 1},
    "dark": {"N": 15, "R": 10, "SR": 5, "SSR": 3, "UR": 1},
}

def create_card_image(card_id, element, rarity, index):
    """创建单张卡牌图片"""
    # 卡牌尺寸 9:16
    width, height = 360, 640
    
    # 基础颜色
    elem_color = ELEMENT_COLORS[element]
    rare_color = RARITY_COLORS[rarity]
    
    # 创建渐变背景
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)
    
    # 元素渐变背景
    for y in range(height):
        ratio = y / height
        r = int(elem_color[0] * (1 - ratio) + 30 * ratio)
        g = int(elem_color[1] * (1 - ratio) + 30 * ratio)
        b = int(elem_color[2] * (1 - ratio) + 40 * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    # 稀有度边框
    border_width = 8 if rarity == "N" else 10 if rarity == "R" else 12 if rarity == "SR" else 15 if rarity == "SSR" else 20
    draw.rectangle([border_width//2, border_width//2, width-border_width//2, height-border_width//2], 
                   outline=rare_color, width=border_width)
    
    # 内部装饰框
    draw.rectangle([20, 20, width-20, height-20], outline=(100, 100, 100), width=2)
    
    # 角色区域（圆形）
    center_x = width // 2
    avatar_y = 150
    avatar_radius = 80
    draw.ellipse([center_x - avatar_radius, avatar_y - avatar_radius, 
                  center_x + avatar_radius, avatar_y + avatar_radius], 
                 fill=(elem_color[0]//2, elem_color[1]//2, elem_color[2]//2))
    
    # 绘制文字
    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
    except:
        font_large = ImageFont.load_default()
        font_small = font_large
    
    # 稀有度标识
    draw.rectangle([10, 10, 60, 40], fill=rare_color)
    bbox = draw.textbbox((0, 0), rarity, font=font_small)
    text_w = bbox[2] - bbox[0]
    draw.text((35 - text_w//2, 18), rarity, fill=(255, 255, 255), font=font_small)
    
    # 元素标识
    elem_x = width - 50
    draw.ellipse([elem_x, 10, elem_x + 30, 40], fill=elem_color)
    
    # 卡牌编号
    card_num = f"{element[:1].upper()}{rarity}-{index:03d}"
    draw.text((20, height - 40), card_num, fill=(200, 200, 200), font=font_small)
    
    # 占位符文字
    placeholder = f"Card {card_num}"
    bbox = draw.textbbox((0, 0), placeholder, font=font_large)
    text_w = bbox[2] - bbox[0]
    draw.text((center_x - text_w//2, 300), placeholder, fill=(255, 255, 255), font=font_large)
    
    # 属性区域
    draw.rectangle([40, 400, width-40, 550], outline=(100, 100, 100), width=1)
    draw.text((50, 410), "ATK: ???", fill=(255, 200, 150), font=font_small)
    draw.text((50, 435), "HP: ???", fill=(255, 100, 100), font=font_small)
    draw.text((50, 460), "DEF: ???", fill=(150, 200, 255), font=font_small)
    draw.text((50, 485), "SPD: ???", fill=(150, 255, 150), font=font_small)
    
    return img

def generate_all_cards():
    """生成所有700张卡牌"""
    print("=" * 60)
    print("🎴 记忆回收者 - 700张卡牌占位图生成器")
    print("=" * 60)
    
    total = 0
    card_index = {}
    
    for element, rarities in CARD_CONFIG.items():
        print(f"\n🔮 元素: {element}")
        card_index[element] = {}
        
        for rarity, count in rarities.items():
            card_index[element][rarity] = []
            
            for i in range(1, count + 1):
                card_id = f"{element}_{rarity}_{i:03d}"
                filename = f"{BASE_DIR}/{card_id}.png"
                
                img = create_card_image(card_id, element, rarity, i)
                img.save(filename)
                
                card_index[element][rarity].append({
                    "id": card_id,
                    "file": f"cards/{card_id}.png"
                })
                
                total += 1
                if total % 50 == 0:
                    print(f"  进度: {total}/700")
    
    # 保存索引文件
    with open(f"{BASE_DIR}/../card_index.json", 'w', encoding='utf-8') as f:
        json.dump(card_index, f, ensure_ascii=False, indent=2)
    
    print("\n" + "=" * 60)
    print(f"✅ 生成完成! 共 {total} 张卡牌")
    print(f"📁 输出目录: {BASE_DIR}")
    print(f"📋 索引文件: assets/images/card_index.json")
    print("=" * 60)
    
    return total

if __name__ == "__main__":
    generate_all_cards()
