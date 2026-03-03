#!/usr/bin/env python3
"""
记忆回收者 - 700张卡牌角色立绘生成器
使用程序化方式生成多样化的角色立绘
"""

from PIL import Image, ImageDraw, ImageFilter
import os
import random
import math

OUTPUT_DIR = "/root/.openclaw/workspace/projects/memory-collector/assets/images/card_characters"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 随机种子保证可复现
random.seed(42)

class CardCharacterGenerator:
    """卡牌角色立绘生成器"""
    
    def __init__(self):
        self.generated_count = 0
        
        # 元素配色方案
        self.element_colors = {
            'metal': {
                'primary': (180, 190, 200),
                'secondary': (220, 220, 230),
                'accent': (255, 215, 0),
                'shadow': (100, 110, 120)
            },
            'wood': {
                'primary': (60, 160, 80),
                'secondary': (100, 200, 100),
                'accent': (200, 255, 150),
                'shadow': (30, 80, 40)
            },
            'water': {
                'primary': (60, 120, 200),
                'secondary': (100, 180, 255),
                'accent': (150, 220, 255),
                'shadow': (30, 60, 120)
            },
            'fire': {
                'primary': (200, 80, 60),
                'secondary': (255, 120, 80),
                'accent': (255, 200, 100),
                'shadow': (120, 40, 30)
            },
            'earth': {
                'primary': (150, 120, 80),
                'secondary': (200, 170, 120),
                'accent': (255, 220, 150),
                'shadow': (80, 60, 40)
            },
            'light': {
                'primary': (255, 220, 150),
                'secondary': (255, 255, 200),
                'accent': (255, 255, 255),
                'shadow': (200, 180, 100)
            },
            'dark': {
                'primary': (80, 60, 100),
                'secondary': (120, 80, 140),
                'accent': (200, 100, 255),
                'shadow': (40, 30, 50)
            }
        }
        
        # 职业/姿态类型
        self.archetypes = [
            'warrior', 'mage', 'archer', 'assassin', 'tank',
            'healer', 'summoner', 'berserker', 'paladin', 'necromancer'
        ]
        
    def generate_silhouette_shape(self, archetype):
        """根据职业生成基础轮廓"""
        shapes = {
            'warrior': self._warrior_shape,
            'mage': self._mage_shape,
            'archer': self._archer_shape,
            'assassin': self._assassin_shape,
            'tank': self._tank_shape,
            'healer': self._healer_shape,
            'summoner': self._mage_shape,
            'berserker': self._warrior_shape,
            'paladin': self._tank_shape,
            'necromancer': self._mage_shape
        }
        return shapes.get(archetype, self._warrior_shape)
    
    def _warrior_shape(self, draw, center_x, base_y, scale, colors):
        """战士轮廓 - 均衡型"""
        # 头部
        head_y = base_y - int(180 * scale)
        head_size = int(35 * scale)
        draw.ellipse([center_x-head_size, head_y-head_size, 
                     center_x+head_size, head_y+head_size], 
                    fill=colors['primary'])
        
        # 身体
        body_top = head_y + head_size
        body_bottom = base_y - int(40 * scale)
        draw.polygon([
            (center_x - int(40*scale), body_top),
            (center_x + int(40*scale), body_top),
            (center_x + int(50*scale), body_bottom),
            (center_x - int(50*scale), body_bottom)
        ], fill=colors['secondary'])
        
        # 武器 - 剑
        sword_x = center_x + int(60 * scale)
        draw.rectangle([sword_x-5, head_y, sword_x+5, base_y-int(20*scale)], 
                      fill=colors['accent'])
        
        # 盾牌
        shield_x = center_x - int(50 * scale)
        draw.ellipse([shield_x-int(25*scale), body_top+10, 
                     shield_x+int(25*scale), body_top+int(70*scale)], 
                    fill=colors['primary'])
    
    def _mage_shape(self, draw, center_x, base_y, scale, colors):
        """法师轮廓 - 长袍型"""
        # 头部
        head_y = base_y - int(190 * scale)
        head_size = int(30 * scale)
        draw.ellipse([center_x-head_size, head_y-head_size, 
                     center_x+head_size, head_y+head_size], 
                    fill=colors['primary'])
        
        # 长袍
        body_top = head_y + head_size
        body_bottom = base_y
        draw.polygon([
            (center_x - int(25*scale), body_top),
            (center_x + int(25*scale), body_top),
            (center_x + int(60*scale), body_bottom),
            (center_x - int(60*scale), body_bottom)
        ], fill=colors['secondary'])
        
        # 法杖
        staff_x = center_x + int(40 * scale)
        draw.rectangle([staff_x-3, head_y-int(40*scale), staff_x+3, base_y], 
                      fill=(139, 90, 43))
        # 法杖顶部
        draw.ellipse([staff_x-int(15*scale), head_y-int(55*scale), 
                     staff_x+int(15*scale), head_y-int(25*scale)], 
                    fill=colors['accent'])
    
    def _archer_shape(self, draw, center_x, base_y, scale, colors):
        """弓手轮廓 - 敏捷型"""
        # 头部
        head_y = base_y - int(185 * scale)
        head_size = int(32 * scale)
        draw.ellipse([center_x-head_size, head_y-head_size, 
                     center_x+head_size, head_y+head_size], 
                    fill=colors['primary'])
        
        # 流线型身体
        body_top = head_y + head_size
        body_bottom = base_y - int(30 * scale)
        draw.polygon([
            (center_x - int(25*scale), body_top),
            (center_x + int(25*scale), body_top),
            (center_x + int(35*scale), body_bottom),
            (center_x - int(35*scale), body_bottom)
        ], fill=colors['secondary'])
        
        # 弓
        bow_x = center_x - int(45 * scale)
        draw.arc([bow_x-int(10*scale), body_top, bow_x+int(10*scale), body_bottom], 
                0, 180, fill=colors['accent'], width=3)
    
    def _assassin_shape(self, draw, center_x, base_y, scale, colors):
        """刺客轮廓 - 紧身型"""
        # 头部（可能带面罩）
        head_y = base_y - int(180 * scale)
        head_size = int(30 * scale)
        draw.ellipse([center_x-head_size, head_y-head_size, 
                     center_x+head_size, head_y+head_size], 
                    fill=colors['shadow'])
        
        # 紧身衣
        body_top = head_y + head_size
        body_bottom = base_y - int(35 * scale)
        draw.polygon([
            (center_x - int(22*scale), body_top),
            (center_x + int(22*scale), body_top),
            (center_x + int(28*scale), body_bottom),
            (center_x - int(28*scale), body_bottom)
        ], fill=colors['primary'])
        
        # 双匕首
        for offset in [-int(30*scale), int(30*scale)]:
            dagger_x = center_x + offset
            draw.polygon([
                (dagger_x, body_top+int(20*scale)),
                (dagger_x+int(8*scale), body_top+int(60*scale)),
                (dagger_x, body_top+int(70*scale)),
                (dagger_x-int(8*scale), body_top+int(60*scale))
            ], fill=colors['accent'])
    
    def _tank_shape(self, draw, center_x, base_y, scale, colors):
        """坦克轮廓 - 重甲型"""
        # 头部（头盔）
        head_y = base_y - int(170 * scale)
        head_size = int(38 * scale)
        draw.ellipse([center_x-head_size, head_y-head_size, 
                     center_x+head_size, head_y+head_size], 
                    fill=colors['primary'])
        
        # 厚重身体
        body_top = head_y + head_size
        body_bottom = base_y - int(20 * scale)
        draw.polygon([
            (center_x - int(55*scale), body_top),
            (center_x + int(55*scale), body_top),
            (center_x + int(65*scale), body_bottom),
            (center_x - int(65*scale), body_bottom)
        ], fill=colors['secondary'])
        
        # 巨盾
        shield_x = center_x - int(60 * scale)
        draw.rectangle([shield_x-int(15*scale), body_top, 
                       shield_x+int(15*scale), body_bottom], 
                      fill=colors['primary'])
    
    def _healer_shape(self, draw, center_x, base_y, scale, colors):
        """治疗轮廓 - 长袍+法器"""
        # 头部
        head_y = base_y - int(188 * scale)
        head_size = int(30 * scale)
        draw.ellipse([center_x-head_size, head_y-head_size, 
                     center_x+head_size, head_y+head_size], 
                    fill=colors['primary'])
        
        # 飘逸长袍
        body_top = head_y + head_size
        body_bottom = base_y
        draw.polygon([
            (center_x - int(30*scale), body_top),
            (center_x + int(30*scale), body_top),
            (center_x + int(55*scale), body_bottom),
            (center_x - int(55*scale), body_bottom)
        ], fill=colors['secondary'])
        
        # 治疗法器（书/卷轴）
        book_x = center_x + int(35 * scale)
        draw.rectangle([book_x-int(12*scale), body_top+int(20*scale), 
                       book_x+int(12*scale), body_top+int(50*scale)], 
                      fill=colors['accent'])
    
    def add_decorative_elements(self, draw, center_x, base_y, scale, colors, element):
        """添加装饰性元素"""
        # 元素特效
        if element == 'fire':
            # 火焰粒子
            for i in range(5):
                x = center_x + random.randint(-int(60*scale), int(60*scale))
                y = base_y - random.randint(0, int(200*scale))
                r = random.randint(3, 8)
                draw.ellipse([x-r, y-r, x+r, y+r], fill=(255, 150, 50, 180))
        
        elif element == 'water':
            # 水波纹
            for i in range(3):
                y = base_y - int(40*scale) - i * int(30*scale)
                draw.arc([center_x-int(50*scale), y, center_x+int(50*scale), y+int(20*scale)], 
                        0, 180, fill=colors['accent'], width=2)
        
        elif element == 'metal':
            # 金属光泽线条
            for i in range(3):
                x = center_x + random.randint(-int(40*scale), int(40*scale))
                draw.line([(x, base_y-int(180*scale)), (x, base_y-int(40*scale))], 
                         fill=(255, 255, 255, 150), width=2)
        
        elif element == 'wood':
            # 叶子
            for i in range(4):
                x = center_x + random.randint(-int(50*scale), int(50*scale))
                y = base_y - random.randint(int(100*scale), int(200*scale))
                draw.ellipse([x-5, y-8, x+5, y+8], fill=colors['accent'])
        
        elif element == 'earth':
            # 岩石碎片
            for i in range(3):
                x = center_x + random.randint(-int(70*scale), int(70*scale))
                y = base_y - random.randint(0, int(50*scale))
                size = random.randint(5, 12)
                draw.rectangle([x, y, x+size, y+size], fill=colors['shadow'])
        
        elif element == 'light':
            # 光芒射线
            for angle in range(0, 360, 30):
                rad = math.radians(angle)
                x1 = center_x + int(40 * scale * math.cos(rad))
                y1 = base_y - int(120 * scale) + int(40 * scale * math.sin(rad))
                x2 = center_x + int(80 * scale * math.cos(rad))
                y2 = base_y - int(120 * scale) + int(80 * scale * math.sin(rad))
                draw.line([(x1, y1), (x2, y2)], fill=colors['accent'], width=2)
        
        elif element == 'dark':
            # 暗影触须
            for i in range(4):
                start_x = center_x + random.randint(-int(30*scale), int(30*scale))
                start_y = base_y - int(160*scale)
                end_x = start_x + random.randint(-int(40*scale), int(40*scale))
                end_y = start_y + random.randint(int(60*scale), int(120*scale))
                draw.line([(start_x, start_y), (end_x, end_y)], 
                         fill=colors['shadow'], width=3)
    
    def generate_card_character(self, card_id, element, rarity):
        """生成单张卡牌角色立绘"""
        # 画布尺寸 (2:3比例，适合卡牌)
        width, height = 400, 600
        
        img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # 获取配色
        colors = self.element_colors[element]
        
        # 根据卡牌ID确定随机种子（保证同一ID总是生成相同角色）
        card_seed = int(card_id.split('_')[-1])
        random.seed(card_seed)
        
        # 选择职业
        archetype = self.archetypes[card_seed % len(self.archetypes)]
        
        # 根据稀有度调整比例和细节
        rarity_scale = {
            'N': 0.8,
            'R': 0.85,
            'SR': 0.9,
            'SSR': 0.95,
            'UR': 1.0
        }
        scale = rarity_scale.get(rarity, 0.85)
        
        # 绘制背景渐变
        for y in range(height):
            progress = y / height
            r = int(colors['shadow'][0] * (1-progress) + colors['primary'][0] * progress)
            g = int(colors['shadow'][1] * (1-progress) + colors['primary'][1] * progress)
            b = int(colors['shadow'][2] * (1-progress) + colors['primary'][2] * progress)
            draw.line([(0, y), (width, y)], fill=(r, g, b, 100))
        
        # 绘制角色轮廓
        center_x = width // 2
        base_y = height - 50
        
        shape_func = self.generate_silhouette_shape(archetype)
        shape_func(draw, center_x, base_y, scale, colors)
        
        # 添加装饰元素
        self.add_decorative_elements(draw, center_x, base_y, scale, colors, element)
        
        # 添加稀有度光晕
        if rarity in ['SSR', 'UR']:
            # 金色边框光效
            border_width = 10 if rarity == 'SSR' else 15
            draw.rectangle([border_width, border_width, width-border_width, height-border_width], 
                          outline=(255, 215, 0, 150), width=border_width)
        
        # 重置随机种子
        random.seed(42)
        
        return img
    
    def generate_all_characters(self):
        """生成所有卡牌角色立绘"""
        print("=" * 70)
        print("🎨 700张卡牌角色立绘生成器")
        print("=" * 70)
        
        # 读取卡牌索引
        import json
        with open('/root/.openclaw/workspace/projects/memory-collector/assets/images/card_index.json', 'r') as f:
            card_index = json.load(f)
        
        total = 0
        for element, rarities in card_index.items():
            print(f"\n🔮 {element} 元素角色:")
            for rarity, cards in rarities.items():
                for card in cards:
                    card_id = card['id']
                    img = self.generate_card_character(card_id, element, rarity)
                    
                    filename = f"{OUTPUT_DIR}/{card_id}.png"
                    img.save(filename)
                    
                    total += 1
                    if total % 50 == 0:
                        print(f"  进度: {total}/403")
        
        print("\n" + "=" * 70)
        print(f"✅ 角色立绘生成完成!")
        print(f"📁 输出目录: {OUTPUT_DIR}")
        print(f"🎨 生成数量: {total} 张")
        print("=" * 70)

if __name__ == "__main__":
    generator = CardCharacterGenerator()
    generator.generate_all_characters()
