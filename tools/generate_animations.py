#!/usr/bin/env python3
"""
记忆回收者 - 程序化动画和特效生成器
使用PIL生成帧动画和特效序列
"""

from PIL import Image, ImageDraw, ImageFilter
import os
import math

OUTPUT_DIR = "/root/.openclaw/workspace/projects/memory-collector/assets/animations"
os.makedirs(OUTPUT_DIR, exist_ok=True)

class AnimationGenerator:
    """动画生成器"""
    
    def __init__(self):
        self.frame_count = 0
    
    def generate_attack_animation(self, name, color):
        """生成攻击动画帧序列"""
        print(f"⚔️ 生成攻击动画: {name}")
        anim_dir = f"{OUTPUT_DIR}/{name}_attack"
        os.makedirs(anim_dir, exist_ok=True)
        
        frames = []
        for i in range(8):
            # 创建攻击效果帧
            img = Image.new('RGBA', (256, 256), (0, 0, 0, 0))
            draw = ImageDraw.Draw(img)
            
            # 计算攻击动画进度
            progress = i / 7.0
            
            # 绘制剑光/攻击轨迹
            if progress < 0.5:
                # 蓄力阶段
                size = int(50 + progress * 100)
                alpha = int(100 + progress * 155)
                x = int(128 - 80 + progress * 160)
                y = 128
            else:
                # 斩击阶段
                size = int(150 - (progress - 0.5) * 100)
                alpha = int(255 - (progress - 0.5) * 200)
                x = int(128 + 80 - (progress - 0.5) * 160)
                y = 128
            
            # 绘制光效
            for j in range(5):
                offset = j * 10
                a = max(0, alpha - j * 40)
                draw.ellipse([x-size-offset, y-size-offset, x+size+offset, y+size+offset], 
                            fill=(color[0], color[1], color[2], a))
            
            frame_path = f"{anim_dir}/frame_{i:02d}.png"
            img.save(frame_path)
            frames.append(frame_path)
        
        self.frame_count += len(frames)
        print(f"  ✅ 生成 {len(frames)} 帧")
        return frames
    
    def generate_buff_animation(self, name, color):
        """生成增益动画"""
        print(f"✨ 生成增益动画: {name}")
        anim_dir = f"{OUTPUT_DIR}/{name}_buff"
        os.makedirs(anim_dir, exist_ok=True)
        
        frames = []
        for i in range(12):
            img = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
            draw = ImageDraw.Draw(img)
            
            # 旋转的光圈效果
            angle = (i / 12.0) * 360
            center = 100
            
            for ring in range(3):
                radius = 40 + ring * 20
                offset = ring * 30
                
                # 计算旋转后的位置
                rad = math.radians(angle + offset)
                x = center + int(radius * math.cos(rad))
                y = center + int(radius * math.sin(rad))
                
                size = 15 - ring * 3
                alpha = 200 - ring * 50
                draw.ellipse([x-size, y-size, x+size, y+size], 
                            fill=(color[0], color[1], color[2], alpha))
            
            frame_path = f"{anim_dir}/frame_{i:02d}.png"
            img.save(frame_path)
            frames.append(frame_path)
        
        self.frame_count += len(frames)
        print(f"  ✅ 生成 {len(frames)} 帧")
        return frames
    
    def generate_card_flip_animation(self):
        """生成卡牌翻转动画"""
        print(f"🃏 生成卡牌翻转动画")
        anim_dir = f"{OUTPUT_DIR}/card_flip"
        os.makedirs(anim_dir, exist_ok=True)
        
        frames = []
        width, height = 180, 280
        
        for i in range(10):
            img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
            draw = ImageDraw.Draw(img)
            
            # 计算翻转进度
            progress = i / 9.0
            
            # 缩放模拟3D翻转
            if progress < 0.5:
                # 翻到背面
                scale = 1.0 - progress * 2  # 1.0 -> 0.0
                show_back = False
            else:
                # 翻到正面
                scale = (progress - 0.5) * 2  # 0.0 -> 1.0
                show_back = True
            
            scaled_width = int(width * abs(scale))
            offset_x = (width - scaled_width) // 2
            
            if not show_back:
                # 背面（纯色+花纹）
                draw.rectangle([offset_x, 0, offset_x + scaled_width, height], 
                              fill=(80, 60, 100))
                # 花纹
                for y in range(20, height-20, 40):
                    draw.line([(offset_x+10, y), (offset_x+scaled_width-10, y)], 
                             fill=(100, 80, 120), width=2)
            else:
                # 正面（渐变边框）
                draw.rectangle([offset_x, 0, offset_x + scaled_width, height], 
                              fill=(40, 40, 60), outline=(200, 180, 100), width=3)
                # 内容区域
                if scaled_width > 50:
                    draw.rectangle([offset_x+10, 40, offset_x+scaled_width-10, height-40], 
                                  fill=(60, 60, 80))
            
            # 添加光效
            if 0.4 < progress < 0.6:
                # 翻转中间时刻的闪光
                flash_alpha = int(255 * (1 - abs(progress - 0.5) * 10))
                draw.rectangle([0, height//3, width, height*2//3], 
                              fill=(255, 255, 255, flash_alpha))
            
            frame_path = f"{anim_dir}/frame_{i:02d}.png"
            img.save(frame_path)
            frames.append(frame_path)
        
        self.frame_count += len(frames)
        print(f"  ✅ 生成 {len(frames)} 帧")
        return frames
    
    def generate_gacha_rare_effect(self, rarity):
        """生成抽卡稀有度特效"""
        print(f"🎰 生成抽卡特效: {rarity}")
        anim_dir = f"{OUTPUT_DIR}/gacha_{rarity}"
        os.makedirs(anim_dir, exist_ok=True)
        
        # 根据稀有度设置颜色
        colors = {
            "r": (100, 150, 255),    # 蓝
            "sr": (200, 100, 255),   # 紫
            "ssr": (255, 200, 100),  # 金
            "ur": (255, 100, 100),   # 红
        }
        color = colors.get(rarity, (200, 200, 200))
        
        frames = []
        for i in range(20):
            img = Image.new('RGBA', (400, 600), (0, 0, 0, 0))
            draw = ImageDraw.Draw(img)
            
            center_x, center_y = 200, 300
            
            # 光芒爆发
            if i < 10:
                # 爆发阶段
                max_radius = 50 + i * 20
                for r in range(0, max_radius, 10):
                    alpha = int(255 * (1 - r/max_radius) * (1 - i/20))
                    draw.ellipse([center_x-r, center_y-r, center_x+r, center_y+r],
                                fill=(color[0], color[1], color[2], alpha))
            else:
                # 稳定阶段
                for r in range(0, 200, 20):
                    alpha = int(150 * (1 - r/200) * (1 - (i-10)/20))
                    draw.ellipse([center_x-r, center_y-r, center_x+r, center_y+r],
                                fill=(color[0], color[1], color[2], alpha))
            
            # 星星粒子
            for j in range(10):
                angle = (j * 36 + i * 10) % 360
                rad = math.radians(angle)
                dist = 100 + (i * 5) % 100
                x = center_x + int(dist * math.cos(rad))
                y = center_y + int(dist * math.sin(rad))
                size = 5 + (i % 3)
                alpha = 200 - (i * 8)
                if alpha > 0:
                    draw.ellipse([x-size, y-size, x+size, y+size],
                                fill=(255, 255, 200, alpha))
            
            frame_path = f"{anim_dir}/frame_{i:02d}.png"
            img.save(frame_path)
            frames.append(frame_path)
        
        self.frame_count += len(frames)
        print(f"  ✅ 生成 {len(frames)} 帧")
        return frames
    
    def generate_all_animations(self):
        """生成所有动画"""
        print("=" * 60)
        print("🎬 程序化动画生成器")
        print("=" * 60)
        
        # 攻击动画
        self.generate_attack_animation("fire", (255, 100, 50))
        self.generate_attack_animation("water", (50, 150, 255))
        self.generate_attack_animation("metal", (200, 200, 220))
        
        # 增益动画
        self.generate_buff_animation("heal", (100, 255, 100))
        self.generate_buff_animation("shield", (150, 200, 255))
        self.generate_buff_animation("power", (255, 200, 100))
        
        # 特殊动画
        self.generate_card_flip_animation()
        
        # 抽卡特效
        self.generate_gacha_rare_effect("r")
        self.generate_gacha_rare_effect("sr")
        self.generate_gacha_rare_effect("ssr")
        self.generate_gacha_rare_effect("ur")
        
        print("\n" + "=" * 60)
        print(f"✅ 动画生成完成!")
        print(f"📁 输出目录: {OUTPUT_DIR}")
        print(f"🎞️ 总帧数: {self.frame_count}")
        print("=" * 60)

if __name__ == "__main__":
    generator = AnimationGenerator()
    generator.generate_all_animations()
