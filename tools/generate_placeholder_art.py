#!/usr/bin/env python3
"""
记忆回收者 - 占位美术资源生成器
使用PIL生成基础占位图，后续替换为AI生成资源
"""

from PIL import Image, ImageDraw, ImageFont
import os
import math

# 输出目录
BASE_DIR = "/root/.openclaw/workspace/projects/memory-collector/assets/images"

# 确保目录存在
for subdir in ["characters", "cards", "ui", "scenes", "icons"]:
    os.makedirs(f"{BASE_DIR}/{subdir}", exist_ok=True)

# 角色配置（6主角 × 3版本）
CHARACTERS = [
    {"id": "jin_yu", "name": "烬羽", "element": "fire", "color": (255, 100, 50)},
    {"id": "shuang_ren", "name": "霜刃", "element": "water", "color": (50, 150, 255)},
    {"id": "lei_yin", "name": "雷音", "element": "metal", "color": (200, 50, 200)},
    {"id": "qing_lan", "name": "青岚", "element": "wood", "color": (50, 200, 100)},
    {"id": "yue_chen", "name": "岳尘", "element": "earth", "color": (150, 100, 50)},
    {"id": "you_zhu", "name": "幽烛", "element": "dark", "color": (100, 50, 150)},
]

VERSIONS = [
    ("normal", "普通", (400, 600)),
    ("awakened", "觉醒", (400, 600)),
    ("chibi", "Q版", (300, 300))
]

def create_gradient(width, height, color1, color2):
    """创建渐变背景"""
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)
    for y in range(height):
        r = int(color1[0] + (color2[0] - color1[0]) * y / height)
        g = int(color1[1] + (color2[1] - color1[1]) * y / height)
        b = int(color1[2] + (color2[2] - color1[2]) * y / height)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    return img

def draw_character_placeholder(img, name, version, element_color, draw):
    """绘制角色占位图"""
    width, height = img.size
    
    # 绘制角色剪影（圆形+身体）
    center_x = width // 2
    head_y = height // 3
    
    # 头
    head_radius = min(width, height) // 6
    draw.ellipse([center_x - head_radius, head_y - head_radius, 
                  center_x + head_radius, head_y + head_radius], 
                 fill=(element_color[0]//2, element_color[1]//2, element_color[2]//2))
    
    # 身体
    body_top = head_y + head_radius
    body_height = height // 3
    draw.polygon([
        (center_x - head_radius, body_top),
        (center_x + head_radius, body_top),
        (center_x + head_radius*2, body_top + body_height),
        (center_x - head_radius*2, body_top + body_height)
    ], fill=(element_color[0]//3, element_color[1]//3, element_color[2]//3))
    
    # 绘制文字
    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 32)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
    except:
        font_large = ImageFont.load_default()
        font_small = font_large
    
    # 名字
    bbox = draw.textbbox((0, 0), name, font=font_large)
    text_width = bbox[2] - bbox[0]
    draw.text((center_x - text_width//2, 20), name, fill=(255, 255, 255), font=font_large)
    
    # 版本
    bbox = draw.textbbox((0, 0), version, font=font_small)
    text_width = bbox[2] - bbox[0]
    draw.text((center_x - text_width//2, height - 50), version, fill=(200, 200, 200), font=font_small)
    
    # 元素标识
    draw.ellipse([width - 50, 20, width - 20, 50], fill=element_color)

def generate_character_images():
    """生成角色立绘"""
    print("🎨 生成角色立绘...")
    for char in CHARACTERS:
        for version_key, version_name, size in VERSIONS:
            # 根据版本调整颜色
            if version_key == "awakened":
                bg_color1 = (char["color"][0]//2, char["color"][1]//2, char["color"][2]//2)
                bg_color2 = (char["color"][0], char["color"][1], char["color"][2])
            elif version_key == "chibi":
                bg_color1 = (240, 240, 240)
                bg_color2 = (200, 200, 220)
            else:
                bg_color1 = (30, 30, 40)
                bg_color2 = (char["color"][0]//4, char["color"][1]//4, char["color"][2]//4)
            
            img = create_gradient(size[0], size[1], bg_color1, bg_color2)
            draw = ImageDraw.Draw(img)
            draw_character_placeholder(img, char["name"], version_name, char["color"], draw)
            
            filename = f"{BASE_DIR}/characters/{char['id']}_{version_key}.png"
            img.save(filename)
            print(f"  ✅ {filename}")

def generate_card_backgrounds():
    """生成卡牌背景"""
    print("\n🃏 生成卡牌背景...")
    
    rarities = [
        ("common", (100, 100, 100)),
        ("rare", (50, 150, 255)),
        ("epic", (200, 50, 200)),
        ("legendary", (255, 200, 50)),
        ("mythic", (255, 50, 50))
    ]
    
    for rarity, color in rarities:
        # 卡牌背景 (9:16比例)
        img = Image.new('RGB', (360, 640), color)
        draw = ImageDraw.Draw(img)
        
        # 边框
        draw.rectangle([10, 10, 350, 630], outline=(255, 255, 255), width=3)
        
        # 稀有度标识
        draw.ellipse([20, 20, 60, 60], fill=color)
        
        filename = f"{BASE_DIR}/cards/card_bg_{rarity}.png"
        img.save(filename)
        print(f"  ✅ {filename}")

def generate_ui_elements():
    """生成UI元素"""
    print("\n🖼️ 生成UI元素...")
    
    # 按钮
    for name, color in [("btn_normal", (100, 100, 200)), ("btn_hover", (150, 150, 255)), ("btn_disabled", (100, 100, 100))]:
        img = Image.new('RGB', (200, 60), color)
        draw = ImageDraw.Draw(img)
        draw.rectangle([2, 2, 198, 58], outline=(255, 255, 255), width=2)
        img.save(f"{BASE_DIR}/ui/{name}.png")
    
    # 面板
    img = Image.new('RGB', (600, 400), (40, 40, 50))
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, 599, 399], outline=(150, 150, 150), width=2)
    img.save(f"{BASE_DIR}/ui/panel.png")
    
    # 血条
    img = Image.new('RGB', (200, 20), (50, 50, 50))
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, 199, 19], outline=(255, 255, 255), width=1)
    draw.rectangle([2, 2, 150, 17], fill=(200, 50, 50))
    img.save(f"{BASE_DIR}/ui/hp_bar.png")
    
    print("  ✅ UI元素生成完成")

def generate_scene_backgrounds():
    """生成场景背景"""
    print("\n🏞️ 生成场景背景...")
    
    scenes = [
        ("main_city", (100, 100, 120), "主城"),
        ("battle", (80, 60, 60), "战斗场景"),
        ("gacha", (80, 60, 100), "抽卡界面"),
        ("shop", (100, 80, 60), "商店"),
        ("dungeon", (40, 40, 50), "地牢"),
    ]
    
    for name, color, label in scenes:
        # 竖屏背景
        img = Image.new('RGB', (720, 1280), color)
        draw = ImageDraw.Draw(img)
        
        # 添加一些装饰性元素
        for i in range(10):
            y = i * 120 + 50
            draw.line([(0, y), (720, y)], fill=(color[0]+20, color[1]+20, color[2]+20), width=2)
        
        filename = f"{BASE_DIR}/scenes/{name}.png"
        img.save(filename)
        print(f"  ✅ {filename}")

def generate_icons():
    """生成图标"""
    print("\n🔮 生成图标...")
    
    # 元素图标
    elements = [
        ("fire", (255, 100, 50)),
        ("water", (50, 150, 255)),
        ("wood", (50, 200, 100)),
        ("metal", (200, 200, 200)),
        ("earth", (150, 100, 50)),
        ("light", (255, 255, 200)),
        ("dark", (100, 50, 150))
    ]
    
    for name, color in elements:
        img = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        draw.ellipse([4, 4, 60, 60], fill=color)
        img.save(f"{BASE_DIR}/icons/element_{name}.png")
    
    # 货币图标
    for name, color in [("gold", (255, 200, 50)), ("diamond", (50, 200, 255)), ("energy", (50, 255, 100))]:
        img = Image.new('RGBA', (48, 48), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        draw.ellipse([4, 4, 44, 44], fill=color)
        img.save(f"{BASE_DIR}/icons/{name}.png")
    
    print("  ✅ 图标生成完成")

def main():
    print("=" * 50)
    print("🎮 记忆回收者 - 占位美术资源生成器")
    print("=" * 50)
    
    generate_character_images()
    generate_card_backgrounds()
    generate_ui_elements()
    generate_scene_backgrounds()
    generate_icons()
    
    print("\n" + "=" * 50)
    print("✅ 所有占位资源生成完成！")
    print(f"📁 输出目录: {BASE_DIR}")
    print("=" * 50)

if __name__ == "__main__":
    main()
