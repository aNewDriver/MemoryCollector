#!/bin/bash
# 记忆回收者 - 音频资源占位生成器
# 创建音频资源目录结构和占位文件

AUDIO_DIR="/root/.openclaw/workspace/projects/memory-collector/assets/audio"

echo "🎵 创建音频资源目录结构..."

# 创建目录
for dir in bgm sfx ui battle; do
    mkdir -p "$AUDIO_DIR/$dir"
done

# 创建占位文件（空文件，用于代码引用检查）
echo "📄 创建音频占位文件..."

# BGM
touch "$AUDIO_DIR/bgm/main_theme.ogg"
touch "$AUDIO_DIR/bgm/city_ambient.ogg"
touch "$AUDIO_DIR/bgm/battle_normal.ogg"
touch "$AUDIO_DIR/bgm/battle_boss.ogg"
touch "$AUDIO_DIR/bgm/gacha.ogg"

# UI音效
touch "$AUDIO_DIR/ui/click.ogg"
touch "$AUDIO_DIR/ui/confirm.ogg"
touch "$AUDIO_DIR/ui/cancel.ogg"
touch "$AUDIO_DIR/ui/popup.ogg"
touch "$AUDIO_DIR/ui/slide.ogg"

# 战斗音效
touch "$AUDIO_DIR/battle/attack_normal.ogg"
touch "$AUDIO_DIR/battle/attack_heavy.ogg"
touch "$AUDIO_DIR/battle/skill_cast.ogg"
touch "$AUDIO_DIR/battle/buff.ogg"
touch "$AUDIO_DIR/battle/debuff.ogg"
touch "$AUDIO_DIR/battle/victory.ogg"
touch "$AUDIO_DIR/battle/defeat.ogg"

# 特殊音效
touch "$AUDIO_DIR/sfx/card_flip.ogg"
touch "$AUDIO_DIR/sfx/gacha_rare.ogg"
touch "$AUDIO_DIR/sfx/gacha_epic.ogg"
touch "$AUDIO_DIR/sfx/gacha_legendary.ogg"
touch "$AUDIO_DIR/sfx/level_up.ogg"

echo "✅ 音频占位文件创建完成！"
echo ""
echo "📋 音频资源清单："
find "$AUDIO_DIR" -type f | wc -l
echo "个文件"
echo ""
echo "💡 提示：使用以下方式获取真实音频资源："
echo "1. 访问 https://kenney.nl/assets 下载免费音效包"
echo "2. 使用 tools/download_sfx_auto.sh 脚本（需网络连接）"
echo "3. 委托音频团队制作"
