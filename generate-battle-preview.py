#!/usr/bin/env python3
"""
生成记忆回收者战斗界面预览
"""

from PIL import Image, ImageDraw, ImageFont

width, height = 390, 844
img = Image.new('RGB', (width, height), '#0f0f1a')
draw = ImageDraw.Draw(img)

def draw_rounded_rect(draw, xy, radius, fill, outline=None):
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline)

try:
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
    font_normal = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
    font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
    font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 32)
except:
    font_title = font_normal = font_small = font_large = ImageFont.load_default()

# 顶部
draw.rectangle([0, 0, width, 50], fill='#1a1a2e')
draw.text((width//2, 30), "战斗中", fill='#ffd700', font=font_title, anchor='mm')

# 敌人区域
y = 70
draw_rounded_rect(draw, [20, y, width-20, y+120], 12, '#2a1a1a', '#ff4444')
draw.text((width//2, y+20), "👹", fill='#ffffff', font=font_large, anchor='mm')
draw.text((width//2, y+55), "记忆守卫 Lv.1", fill='#ffffff', font=font_normal, anchor='mm')

# 敌人HP条
draw.rounded_rectangle([40, y+75, width-40, y+95], radius=10, fill='#3a1a1a', outline='#ff4444')
draw.rounded_rectangle([40, y+75, width-120, y+95], radius=10, fill='#ff4444')
draw.text((width//2, y+108), "350 / 500 HP", fill='#ff8888', font=font_small, anchor='mm')

# 玩家区域
y = 220
draw_rounded_rect(draw, [20, y, width-20, y+80], 12, '#1a2a1a', '#44ff44')
draw.text((width//2, y+20), "我的回合 - 选择卡牌攻击!", fill='#44ff44', font=font_normal, anchor='mm')
draw.text((width//2, y+50), "HP: 280 / 300", fill='#88ff88', font=font_normal, anchor='mm')

# 手牌区域
y = 320
draw.text((30, y), "手牌", fill='#ffd700', font=font_normal)

# 三张手牌
cards = [
    ("火", "烬羽", "SSR", "150", "#ff6b6b"),
    ("水", "青漪", "SR", "120", "#4ecdc4"),
    ("金", "银锋", "R", "180", "#c0c0c0"),
]
card_width = 100
card_height = 140
start_x = (width - (card_width * 3 + 20)) // 2

for i, (elem, name, rarity, power, color) in enumerate(cards):
    x = start_x + i * (card_width + 10)
    draw_rounded_rect(draw, [x, y+30, x+card_width, y+30+card_height], 10, '#2a2a4a', color)
    
    # 稀有度
    draw.text((x+10, y+40), rarity, fill=color, font=font_small)
    
    # 元素图标
    draw.text((x + card_width//2, y+75), elem, fill='#ffffff', font=font_large, anchor='mm')
    
    # 名字
    draw.text((x + card_width//2, y+105), name, fill='#ffffff', font=font_small, anchor='mm')
    
    # 战力
    draw.text((x + card_width//2, y+125), power, fill='#ffd700', font=font_normal, anchor='mm')

# 按钮
y = 520
draw_rounded_rect(draw, [20, y, width-20, y+50], 25, '#667eea', '#764ba2')
draw.text((width//2, y+25), "结束回合", fill='#ffffff', font=font_normal, anchor='mm')

y = 580
draw_rounded_rect(draw, [20, y, width-20, y+50], 25, '#2a2a4a', '#444444')
draw.text((width//2, y+25), "逃跑", fill='#ffffff', font=font_normal, anchor='mm')

# 战斗记录
y = 650
draw_rounded_rect(draw, [20, y, width-20, y+140], 12, '#1a1a2e', '#333333')
draw.text((30, y+15), "战斗记录", fill='#ffd700', font=font_normal)

logs = [
    "烬羽 触发克制! 造成 195 伤害!",
    "敌人造成 25 伤害!",
    "青漪 造成 120 伤害",
    "战斗开始!",
]
log_y = y + 45
for log in logs:
    if "克制" in log:
        color = '#ff6b6b'
    elif "伤害" in log and "敌人" in log:
        color = '#ff4444'
    else:
        color = '#aaaaaa'
    draw.text((30, log_y), log, fill=color, font=font_small)
    log_y += 22

# 底部
draw.rectangle([0, height-40, width, height], fill='#1a1a2e')
draw.text((width//2, height-20), "点击卡牌进行攻击", fill='#666666', font=font_small, anchor='mm')

output_path = '/root/.openclaw/workspace/projects/memory-collector/mobile-demo-battle.png'
img.save(output_path)
print(f"✅ 战斗界面预览: {output_path}")
