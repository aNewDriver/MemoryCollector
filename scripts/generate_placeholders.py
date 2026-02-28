#!/usr/bin/env python3
"""
占位图生成器
生成简单的 BMP 格式占位图，无需外部依赖
"""

import os
import struct

# 角色颜色配置
CHARACTER_COLORS = {
    'jin_yu': (220, 80, 40),        # 火 - 橙红
    'qing_yi': (60, 150, 200),      # 水 - 蓝  
    'zhu_feng': (80, 180, 120),     # 风 - 绿
    'yan_xin': (150, 120, 80),      # 土 - 棕
    'ming_zhu': (255, 220, 100),    # 光 - 金黄
    'can_ying': (80, 60, 120),      # 暗 - 紫
    'blacksmith_zhang': (120, 120, 120),  # 灰
}

def create_bmp(filename, width, height, color, text=None):
    """创建简单的 BMP 图片"""
    
    # BMP 文件头
    file_header = bytearray([
        0x42, 0x4D,             # 'BM'
        0x00, 0x00, 0x00, 0x00, # 文件大小 (稍后填充)
        0x00, 0x00,             # 保留
        0x00, 0x00,             # 保留
        0x36, 0x00, 0x00, 0x00, # 数据偏移 (54字节)
    ])
    
    # DIB 头 (BITMAPINFOHEADER)
    dib_header = bytearray([
        0x28, 0x00, 0x00, 0x00, # 头大小 (40字节)
    ])
    dib_header += struct.pack('<i', width)   # 宽度
    dib_header += struct.pack('<i', height)  # 高度
    dib_header += bytes([0x01, 0x00])        # 颜色平面数
    dib_header += bytes([0x18, 0x00])        # 位深度 (24位)
    dib_header += bytes([0x00, 0x00, 0x00, 0x00])  # 压缩方式 (无)
    dib_header += bytes([0x00, 0x00, 0x00, 0x00])  # 图像大小 (可填0)
    dib_header += bytes([0x00, 0x00, 0x00, 0x00])  # 水平分辨率
    dib_header += bytes([0x00, 0x00, 0x00, 0x00])  # 垂直分辨率
    dib_header += bytes([0x00, 0x00, 0x00, 0x00])  # 颜色数
    dib_header += bytes([0x00, 0x00, 0x00, 0x00])  # 重要颜色数
    
    # 像素数据 (BGR格式，从下到上)
    row_size = (width * 3 + 3) & ~3  # 每行对齐到4字节
    pixel_data = bytearray(row_size * height)
    
    for y in range(height):
        for x in range(width):
            # 添加渐变效果
            gradient = 1 - (y / height) * 0.3
            r = int(color[0] * gradient)
            g = int(color[1] * gradient)
            b = int(color[2] * gradient)
            
            offset = y * row_size + x * 3
            pixel_data[offset] = b
            pixel_data[offset + 1] = g
            pixel_data[offset + 2] = r
    
    # 计算文件大小
    file_size = len(file_header) + len(dib_header) + len(pixel_data)
    file_header[2:6] = struct.pack('<I', file_size)
    
    # 写入文件
    with open(filename, 'wb') as f:
        f.write(file_header)
        f.write(dib_header)
        f.write(pixel_data)
    
    print(f"✓ Created: {filename} ({width}x{height})")

def generate_card_placeholders():
    """生成角色卡牌占位图"""
    output_dir = 'assets/resources/images/cards'
    os.makedirs(output_dir, exist_ok=True)
    
    for char_id, color in CHARACTER_COLORS.items():
        # 头像 512x512
        create_bmp(f'{output_dir}/{char_id}_portrait.bmp', 512, 512, color)
        
        # 全身 1024x1820
        create_bmp(f'{output_dir}/{char_id}_full.bmp', 1024, 1820, color)
        
        # 觉醒版本（更亮）
        if char_id not in ['blacksmith_zhang', 'yan_xin']:
            awaken_color = (
                min(255, color[0] + 40),
                min(255, color[1] + 40),
                min(255, color[2] + 40)
            )
            create_bmp(f'{output_dir}/{char_id}_awaken.bmp', 1024, 1820, awaken_color)
    
    print(f"\n✅ 角色占位图生成完成: {output_dir}")

def generate_ui_placeholders():
    """生成UI占位图"""
    output_dir = 'assets/resources/images/ui'
    os.makedirs(output_dir, exist_ok=True)
    
    # 按钮背景
    create_bmp(f'{output_dir}/btn_primary.bmp', 200, 80, (200, 160, 80))
    create_bmp(f'{output_dir}/btn_secondary.bmp', 200, 80, (80, 120, 160))
    create_bmp(f'{output_dir}/btn_disabled.bmp', 200, 80, (100, 100, 100))
    
    # 面板背景 (深灰色)
    create_bmp(f'{output_dir}/panel_bg.bmp', 600, 800, (40, 40, 45))
    
    # 稀有度边框
    create_bmp(f'{output_dir}/frame_common.bmp', 120, 160, (169, 169, 169))  # 灰
    create_bmp(f'{output_dir}/frame_rare.bmp', 120, 160, (65, 105, 225))     # 蓝
    create_bmp(f'{output_dir}/frame_epic.bmp', 120, 160, (147, 0, 211))      # 紫
    create_bmp(f'{output_dir}/frame_legend.bmp', 120, 160, (255, 215, 0))    # 金
    create_bmp(f'{output_dir}/frame_myth.bmp', 120, 160, (220, 20, 60))      # 红
    
    print(f"\n✅ UI占位图生成完成: {output_dir}")

def generate_icon_placeholders():
    """生成图标占位图"""
    output_dir = 'assets/resources/images/icons'
    os.makedirs(output_dir, exist_ok=True)
    
    icons = [
        ('element_fire', (220, 80, 40)),
        ('element_water', (60, 150, 200)),
        ('element_wind', (80, 180, 120)),
        ('element_earth', (150, 120, 80)),
        ('element_light', (255, 220, 100)),
        ('element_dark', (80, 60, 120)),
        ('icon_gold', (255, 200, 60)),
        ('icon_crystal', (120, 200, 255)),
        ('icon_exp', (100, 220, 100)),
        ('icon_energy', (255, 180, 60)),
    ]
    
    for name, color in icons:
        create_bmp(f'{output_dir}/{name}.bmp', 128, 128, color)
    
    print(f"\n✅ 图标占位图生成完成: {output_dir}")

def main():
    print("🎨 生成游戏占位图资源...\n")
    print("=" * 50)
    
    generate_card_placeholders()
    print()
    generate_ui_placeholders()
    print()
    generate_icon_placeholders()
    
    print("\n" + "=" * 50)
    print("✅ 所有占位图生成完成!")
    print("\n📋 说明:")
    print("- 格式: BMP (无压缩，Cocos Creator 可直接使用)")
    print("- 这些只是占位图，用于让游戏能运行起来")
    print("- 后续请用 AI 生成正式的美术资源替换")
    print("\n🎮 现在可以用 Cocos Creator 打开项目预览了!")

if __name__ == '__main__':
    main()
