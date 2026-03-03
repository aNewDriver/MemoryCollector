#!/usr/bin/env python3
"""
记忆回收者 - 位图字体生成器
生成数字和常用字符的位图字体
"""

from PIL import Image, ImageDraw, ImageFont
import os
import json

OUTPUT_DIR = "/root/.openclaw/workspace/projects/memory-collector/assets/fonts"
os.makedirs(OUTPUT_DIR, exist_ok=True)

class BitmapFontGenerator:
    """位图字体生成器"""
    
    def __init__(self):
        self.chars = "0123456789+-×÷=.,!?%ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        self.fonts = {}
    
    def try_load_font(self, font_name, size):
        """尝试加载系统字体"""
        font_paths = [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
            "/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc",
            "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
        ]
        
        for path in font_paths:
            if os.path.exists(path):
                try:
                    return ImageFont.truetype(path, size)
                except:
                    continue
        
        return ImageFont.load_default()
    
    def generate_number_font(self, size=48):
        """生成数字字体图集"""
        print(f"🔢 生成数字字体 (size={size})...")
        
        numbers = "0123456789"
        char_width = size
        char_height = int(size * 1.2)
        
        # 计算图集尺寸 (10个数字排成一行)
        atlas_width = char_width * len(numbers)
        atlas_height = char_height
        
        img = Image.new('RGBA', (atlas_width, atlas_height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        font = self.try_load_font("bold", size)
        
        char_map = {}
        for i, char in enumerate(numbers):
            x = i * char_width
            y = 0
            
            # 绘制字符
            bbox = draw.textbbox((0, 0), char, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            
            # 居中
            text_x = x + (char_width - text_width) // 2
            text_y = y + (char_height - text_height) // 2
            
            # 金色渐变效果
            draw.text((text_x, text_y), char, fill=(255, 200, 100, 255), font=font)
            
            char_map[char] = {
                "x": x,
                "y": y,
                "width": char_width,
                "height": char_height
            }
        
        img.save(f"{OUTPUT_DIR}/numbers_{size}.png")
        
        with open(f"{OUTPUT_DIR}/numbers_{size}.json", 'w') as f:
            json.dump({
                "texture": f"numbers_{size}.png",
                "size": size,
                "chars": char_map
            }, f, indent=2)
        
        print(f"  ✅ numbers_{size}.png + .json")
        return img
    
    def generate_damage_numbers(self):
        """生成伤害数字字体（带效果）"""
        print(f"💥 生成伤害数字...")
        
        numbers = "0123456789"
        size = 64
        char_width = 60
        char_height = 70
        
        atlas_width = char_width * len(numbers)
        atlas_height = char_height
        
        img = Image.new('RGBA', (atlas_width, atlas_height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        font = self.try_load_font("bold", size)
        
        char_map = {}
        for i, char in enumerate(numbers):
            x = i * char_width
            
            bbox = draw.textbbox((0, 0), char, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            
            text_x = x + (char_width - text_width) // 2
            text_y = (char_height - text_height) // 2
            
            # 描边效果
            for dx in [-2, 0, 2]:
                for dy in [-2, 0, 2]:
                    if dx != 0 or dy != 0:
                        draw.text((text_x+dx, text_y+dy), char, fill=(0, 0, 0, 200), font=font)
            
            # 主文字（红色伤害）
            draw.text((text_x, text_y), char, fill=(255, 80, 80, 255), font=font)
            
            char_map[char] = {"x": x, "y": 0, "width": char_width, "height": char_height}
        
        img.save(f"{OUTPUT_DIR}/damage_numbers.png")
        
        with open(f"{OUTPUT_DIR}/damage_numbers.json", 'w') as f:
            json.dump({"texture": "damage_numbers.png", "chars": char_map}, f, indent=2)
        
        print(f"  ✅ damage_numbers.png + .json")
        return img
    
    def generate_heal_numbers(self):
        """生成治疗数字字体（绿色）"""
        print(f"💚 生成治疗数字...")
        
        numbers = "0123456789+"
        size = 64
        char_width = 60
        char_height = 70
        
        atlas_width = char_width * len(numbers)
        atlas_height = char_height
        
        img = Image.new('RGBA', (atlas_width, atlas_height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        font = self.try_load_font("bold", size)
        
        char_map = {}
        for i, char in enumerate(numbers):
            x = i * char_width
            
            bbox = draw.textbbox((0, 0), char, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            
            text_x = x + (char_width - text_width) // 2
            text_y = (char_height - text_height) // 2
            
            # 描边
            for dx in [-2, 0, 2]:
                for dy in [-2, 0, 2]:
                    if dx != 0 or dy != 0:
                        draw.text((text_x+dx, text_y+dy), char, fill=(0, 0, 0, 200), font=font)
            
            # 绿色治疗
            draw.text((text_x, text_y), char, fill=(100, 255, 100, 255), font=font)
            
            char_map[char] = {"x": x, "y": 0, "width": char_width, "height": char_height}
        
        img.save(f"{OUTPUT_DIR}/heal_numbers.png")
        
        with open(f"{OUTPUT_DIR}/heal_numbers.json", 'w') as f:
            json.dump({"texture": "heal_numbers.png", "chars": char_map}, f, indent=2)
        
        print(f"  ✅ heal_numbers.png + .json")
        return img
    
    def generate_rarity_labels(self):
        """生成稀有度标签"""
        print(f"🏷️ 生成稀有度标签...")
        
        labels = {
            "N": (150, 150, 150),
            "R": (100, 150, 255),
            "SR": (200, 100, 255),
            "SSR": (255, 200, 100),
            "UR": (255, 100, 100)
        }
        
        img_height = 80
        img_width = 120 * len(labels)
        
        img = Image.new('RGBA', (img_width, img_height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        font = self.try_load_font("bold", 48)
        
        x = 0
        label_map = {}
        for label, color in labels.items():
            # 背景
            draw.rounded_rectangle([x+5, 10, x+110, 70], radius=10, fill=(*color, 200))
            
            # 文字
            bbox = draw.textbbox((0, 0), label, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            text_x = x + (115 - text_width) // 2
            text_y = (img_height - text_height) // 2
            
            draw.text((text_x, text_y), label, fill=(255, 255, 255, 255), font=font)
            
            label_map[label] = {"x": x+5, "y": 10, "width": 105, "height": 60}
            x += 120
        
        img.save(f"{OUTPUT_DIR}/rarity_labels.png")
        
        with open(f"{OUTPUT_DIR}/rarity_labels.json", 'w') as f:
            json.dump({"texture": "rarity_labels.png", "labels": label_map}, f, indent=2)
        
        print(f"  ✅ rarity_labels.png + .json")
        return img
    
    def generate_all_fonts(self):
        """生成所有字体"""
        print("=" * 60)
        print("🔤 位图字体生成器")
        print("=" * 60)
        
        self.generate_number_font(32)
        self.generate_number_font(48)
        self.generate_damage_numbers()
        self.generate_heal_numbers()
        self.generate_rarity_labels()
        
        print("\n" + "=" * 60)
        print(f"✅ 字体生成完成!")
        print(f"📁 输出目录: {OUTPUT_DIR}")
        print("=" * 60)

if __name__ == "__main__":
    generator = BitmapFontGenerator()
    generator.generate_all_fonts()
