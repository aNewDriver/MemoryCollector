#!/bin/bash
# 音效资源下载脚本
# 从免费资源网站下载游戏音效

set -e

BASE_DIR="/root/.openclaw/workspace/projects/memory-collector/assets/audio"
echo "🎵 开始下载音效资源..."

# 创建目录结构
mkdir -p $BASE_DIR/{bgm,sfx/{ui,battle,character,system}}

# UI音效 - 使用占位符方式创建清单
cat > $BASE_DIR/sfx/ui/README.md << 'EOF'
# UI音效清单

## 待下载音效

| 文件名 | 用途 | 来源建议 |
|--------|------|---------|
| ui_click.wav | 按钮点击 | Kenney UI Pack |
| ui_hover.wav | 按钮悬停 | Kenney UI Pack |
| ui_back.wav | 返回/关闭 | Kenney UI Pack |
| ui_open.wav | 打开界面 | Kenney UI Pack |
| ui_success.wav | 操作成功 | Kenney UI Pack |
| ui_error.wav | 操作失败 | Kenney UI Pack |
| ui_popup.wav | 弹窗出现 | Kenney UI Pack |
| ui_tab.wav | 切换标签 | Kenney UI Pack |

## 下载地址
- https://kenney.nl/assets/ui-audio
- https://opengameart.org/content/ui-sound-effects-pack
EOF

# 战斗音效清单
cat > $BASE_DIR/sfx/battle/README.md << 'EOF'
# 战斗音效清单

## 待下载音效

| 文件名 | 用途 | 来源建议 |
|--------|------|---------|
| atk_sword.wav | 剑攻击 | RPG Sound Pack |
| atk_mace.wav | 锤攻击 | RPG Sound Pack |
| atk_magic.wav | 魔法攻击 | RPG Sound Pack |
| hit_normal.wav | 受击 | RPG Sound Pack |
| hit_critical.wav | 暴击 | RPG Sound Pack |
| skill_fire.wav | 火系技能 | RPG Sound Pack |
| skill_ice.wav | 冰系技能 | RPG Sound Pack |
| victory.wav | 战斗胜利 | RPG Sound Pack |

## 下载地址
- https://kenney.nl/assets/rpg-audio
- https://opengameart.org/content/rpg-sound-pack
EOF

# 系统音效清单
cat > $BASE_DIR/sfx/system/README.md << 'EOF'
# 系统音效清单

## 待下载音效

| 文件名 | 用途 | 来源建议 |
|--------|------|---------|
| coin_get.wav | 获得金币 | Coin Sound Pack |
| item_get.wav | 获得物品 | Item Sound Pack |
| level_up.wav | 升级 | Level Up Sound |
| gacha_rare.wav | 抽到稀有 | Rare Drop Sound |

## 下载地址
- https://kenney.nl/assets/coin-pack
- https://opengameart.org/content/level-up-sound-effects
EOF

# BGM清单
cat > $BASE_DIR/bgm/README.md << 'EOF'
# 背景音乐清单

## 待获取音乐

| 文件名 | 用途 | 风格 | 来源建议 |
|--------|------|------|---------|
| bgm_main_city.wav | 主城 | 轻松治愈 | OpenGameArt |
| bgm_battle.wav | 战斗 | 紧张激昂 | OpenGameArt |
| bgm_boss.wav | BOSS战 | 黑暗史诗 | OpenGameArt |
| bgm_explore.wav | 探索 | 神秘空灵 | OpenGameArt |
| bgm_reward.wav | 奖励 | 华丽期待 | OpenGameArt |

## 下载地址
- https://opengameart.org/content/role-music
- https://opengameart.org/content/battle-music-pack
- https://opengameart.org/content/fantasy-music-pack
EOF

echo "✅ 音效清单创建完成"
echo ""
echo "📁 目录结构:"
tree $BASE_DIR 2>/dev/null || find $BASE_DIR -type d | head -20

echo ""
echo "📝 下一步:"
echo "1. 访问上述网站下载对应音效文件"
echo "2. 将文件放入对应目录"
echo "3. 统一转换为OGG格式"
echo "4. 在Cocos Creator中配置音频资源"
