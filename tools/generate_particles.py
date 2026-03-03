#!/usr/bin/env python3
"""
记忆回收者 - 粒子效果生成器
生成粒子贴图和粒子配置文件
"""

from PIL import Image, ImageDraw, ImageFilter
import os
import json
import math

OUTPUT_DIR = "/root/.openclaw/workspace/projects/memory-collector/assets/particles"
os.makedirs(OUTPUT_DIR, exist_ok=True)

class ParticleGenerator:
    """粒子效果生成器"""
    
    def __init__(self):
        self.generated = []
    
    def create_glow_particle(self, size=64, color=(255, 200, 100)):
        """创建发光粒子"""
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        center = size // 2
        max_radius = size // 2 - 2
        
        # 径向渐变
        for r in range(max_radius, 0, -1):
            alpha = int(255 * (1 - r / max_radius) ** 0.5)
            draw.ellipse([center-r, center-r, center+r, center+r], 
                        fill=(color[0], color[1], color[2], alpha))
        
        # 中心高光
        highlight_radius = max_radius // 4
        draw.ellipse([center-highlight_radius, center-highlight_radius, 
                     center+highlight_radius, center+highlight_radius],
                    fill=(255, 255, 255, 200))
        
        return img
    
    def create_star_particle(self, size=64, color=(255, 255, 200)):
        """创建星形粒子"""
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        center = size // 2
        points = []
        
        # 五角星
        for i in range(10):
            angle = math.radians(i * 36 - 90)
            radius = size // 2 - 4 if i % 2 == 0 else size // 4
            x = center + radius * math.cos(angle)
            y = center + radius * math.sin(angle)
            points.append((x, y))
        
        draw.polygon(points, fill=(*color, 255))
        
        # 添加发光效果
        img = img.filter(ImageFilter.GaussianBlur(radius=1))
        
        return img
    
    def create_spark_particle(self, size=32, color=(255, 255, 255)):
        """创建火花粒子"""
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        center = size // 2
        
        # 十字形火花
        arm_length = size // 2 - 2
        arm_width = max(1, size // 8)
        
        # 水平
        draw.rectangle([center - arm_length, center - arm_width//2, 
                       center + arm_length, center + arm_width//2],
                      fill=(*color, 255))
        # 垂直
        draw.rectangle([center - arm_width//2, center - arm_length, 
                       center + arm_width//2, center + arm_length],
                      fill=(*color, 255))
        
        # 中心亮点
        draw.ellipse([center-3, center-3, center+3, center+3], 
                    fill=(255, 255, 255, 255))
        
        return img
    
    def create_smoke_particle(self, size=64):
        """创建烟雾粒子"""
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # 随机形状的云
        import random
        random.seed(size)  # 固定随机种子
        
        for _ in range(5):
            x = random.randint(size//4, size*3//4)
            y = random.randint(size//4, size*3//4)
            r = random.randint(size//6, size//3)
            alpha = random.randint(50, 120)
            draw.ellipse([x-r, y-r, x+r, y+r], 
                        fill=(200, 200, 200, alpha))
        
        img = img.filter(ImageFilter.GaussianBlur(radius=2))
        return img
    
    def create_element_particle(self, element, size=64):
        """创建元素粒子"""
        colors = {
            'fire': (255, 100, 50),
            'water': (50, 150, 255),
            'wood': (50, 200, 100),
            'metal': (200, 200, 220),
            'earth': (150, 120, 80),
            'light': (255, 255, 150),
            'dark': (100, 50, 150)
        }
        
        color = colors.get(element, (200, 200, 200))
        
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        center = size // 2
        
        if element == 'fire':
            # 火焰形状
            points = [
                (center, 4),
                (center + size//3, size - 8),
                (center, size - 4),
                (center - size//3, size - 8)
            ]
            draw.polygon(points, fill=(*color, 200))
        
        elif element == 'water':
            # 水滴形状
            draw.ellipse([center-size//3, center-size//6, center+size//3, size-4], 
                        fill=(*color, 200))
            draw.polygon([
                (center, 4),
                (center+size//4, center),
                (center-size//4, center)
            ], fill=(*color, 200))
        
        elif element == 'metal':
            # 菱形
            draw.polygon([
                (center, 4),
                (size-4, center),
                (center, size-4),
                (4, center)
            ], fill=(*color, 220))
        
        else:
            # 默认圆形
            draw.ellipse([4, 4, size-4, size-4], fill=(*color, 200))
        
        img = img.filter(ImageFilter.GaussianBlur(radius=1))
        return img
    
    def generate_all_particles(self):
        """生成所有粒子"""
        print("=" * 60)
        print("✨ 粒子效果生成器")
        print("=" * 60)
        
        # 基础粒子
        particles = [
            ('glow_gold', self.create_glow_particle(64, (255, 200, 100))),
            ('glow_blue', self.create_glow_particle(64, (100, 200, 255))),
            ('glow_red', self.create_glow_particle(64, (255, 100, 100))),
            ('glow_white', self.create_glow_particle(64, (255, 255, 255))),
            ('star', self.create_star_particle(64, (255, 255, 200))),
            ('spark', self.create_spark_particle(32, (255, 255, 255))),
            ('smoke', self.create_smoke_particle(64)),
        ]
        
        # 元素粒子
        for element in ['fire', 'water', 'wood', 'metal', 'earth', 'light', 'dark']:
            particles.append((f'element_{element}', self.create_element_particle(element, 64)))
        
        # 保存
        for name, img in particles:
            path = f"{OUTPUT_DIR}/{name}.png"
            img.save(path)
            self.generated.append(path)
            print(f"  ✅ {name}.png")
        
        # 生成粒子配置文件
        config = {
            "particles": {
                "glow": {"texture": "glow_gold.png", "blend_mode": "add"},
                "star": {"texture": "star.png", "blend_mode": "add"},
                "spark": {"texture": "spark.png", "blend_mode": "add"},
                "smoke": {"texture": "smoke.png", "blend_mode": "normal"},
                "fire": {"texture": "element_fire.png", "blend_mode": "add"},
                "water": {"texture": "element_water.png", "blend_mode": "normal"},
                "wood": {"texture": "element_wood.png", "blend_mode": "normal"},
                "metal": {"texture": "element_metal.png", "blend_mode": "add"},
                "earth": {"texture": "element_earth.png", "blend_mode": "normal"},
                "light": {"texture": "element_light.png", "blend_mode": "add"},
                "dark": {"texture": "element_dark.png", "blend_mode": "add"},
            }
        }
        
        with open(f"{OUTPUT_DIR}/particle_config.json", 'w') as f:
            json.dump(config, f, indent=2)
        
        print(f"\n  ✅ particle_config.json")
        
        print("\n" + "=" * 60)
        print(f"✅ 粒子生成完成!")
        print(f"📁 输出目录: {OUTPUT_DIR}")
        print(f"✨ 粒子数量: {len(self.generated)}")
        print("=" * 60)

if __name__ == "__main__":
    generator = ParticleGenerator()
    generator.generate_all_particles()
