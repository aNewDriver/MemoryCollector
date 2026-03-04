#!/usr/bin/env python3
"""
生成记忆回收者手机版游戏截图预览
"""

from PIL import Image, ImageDraw, ImageFont
import os

# 创建手机尺寸画布 (iPhone 12/13/14 比例)
width, height = 390, 844
img = Image.new('RGB', (width, height), '#0f0f1a')
draw = ImageDraw.Draw(img)

def draw_rounded_rect(draw, xy, radius, fill, outline=None):
    """绘制圆角矩形"""
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline)

# 顶部状态栏
draw.rectangle([0, 0, width, 44], fill='#1a1a2e')

# 标题栏
draw.rectangle([0, 44, width, 110], fill='#1a1a2e')
draw.line([0, 110, width, 110], fill='#ffd700', width=2)

# 标题文字
try:
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24)
    font_sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
    font_normal = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
    font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 11)
except:
    font_title = ImageFont.load_default()
    font_sub = font_normal = font_small = font_title

draw.text((width//2, 60), "🔮 记忆回收者", fill='#ffd700', font=font_title, anchor='mm')
draw.text((width//2, 85), "手机试玩版 v0.1", fill='#888888', font=font_sub, anchor='mm')

# 玩家状态区域
y = 130
draw_rounded_rect(draw, [15, y, width-15, y+100], 12, '#1a1a2e', '#333333')
draw.text((30, y+15), "👤 我的收藏", fill='#ffd700', font=font_normal)

# 三个统计框
stats = [("0", "卡牌数"), ("1000", "金币"), ("50", "钻石")]
box_width = (width - 60) // 3
for i, (value, label) in enumerate(stats):
    x = 30 + i * (box_width + 10)
    draw_rounded_rect(draw, [x, y+40, x+box_width, y+90], 8, '#0f0f1a')
    draw.text((x + box_width//2, y+55), value, fill='#ffd700', font=font_title, anchor='mm')
    draw.text((x + box_width//2, y+78), label, fill='#888888', font=font_small, anchor='mm')

# 按钮区域
y = 250
buttons = [
    ("⚔️ 开始战斗", '#667eea', '#764ba2'),
    ("🎴 抽卡 (100金币)", '#2a2a4a', '#333333'),
    ("📚 查看收藏", '#2a2a4a', '#333333'),
]

for text, bg, border in buttons:
    draw_rounded_rect(draw, [15, y, width-15, y+50], 25, bg, border)
    draw.text((width//2, y+25), text, fill='#ffffff', font=font_normal, anchor='mm')
    y += 60

# 最近获得区域
y = 430
draw_rounded_rect(draw, [15, y, width-15, y+140], 12, '#1a1a2e', '#333333')
draw.text((30, y+15), "🎁 最近获得", fill='#ffd700', font=font_normal)

# 示例卡牌
cards = [
    ("🔥", "SSR", "#ff6b6b", "烬羽"),
    ("💧", "SR", "#4ecdc4", "青漪"),
    ("⚔️", "R", "#c0c0c0", "银锋"),
]
card_width = (width - 60) // 3
for i, (icon, rarity, color, name) in enumerate(cards):
    x = 30 + i * (card_width + 10)
    draw_rounded_rect(draw, [x, y+40, x+card_width, y+120], 8, '#2a2a4a', color)
    draw.text((x + card_width//2, y+55), rarity, fill=color, font=font_small, anchor='mm')
    draw.text((x + card_width//2, y+75), icon, fill='#ffffff', font=font_title, anchor='mm')
    draw.text((x + card_width//2, y+105), name, fill='#ffffff', font=font_small, anchor='mm')

# 战斗记录
y = 580
draw_rounded_rect(draw, [15, y, width-15, y+200], 12, '#1a1a2e', '#333333')
draw.text((30, y+15), "📜 战斗记录", fill='#ffd700', font=font_normal)

logs = [
    "获得 SSR 卡牌: 烬羽 (战力150)",
    "获得 SR 卡牌: 青漪 (战力120)",
    "获得 R 卡牌: 银锋 (战力180)",
    "欢迎来到记忆回收者！点击抽卡...",
]
log_y = y + 45
for log in logs:
    draw.text((30, log_y), log, fill='#aaaaaa', font=font_small)
    log_y += 25

# 底部信息
draw.rectangle([0, height-40, width, height], fill='#1a1a2e')
draw.text((width//2, height-20), "© 2026 记忆回收者 | 试玩版本", fill='#666666', font=font_small, anchor='mm')

# 保存
output_path = '/root/.openclaw/workspace/projects/memory-collector/mobile-demo-preview.png'
img.save(output_path)
print(f"✅ 预览图已生成: {output_path}")
print(f"📱 尺寸: {width}x{height} (iPhone 标准尺寸)")
