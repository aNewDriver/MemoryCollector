#!/bin/bash
# 记忆回收者 - 一键资源生成脚本
# 100%自主生成，无需人工干预

echo "=============================================="
echo "🎮 记忆回收者 - 资源一键生成"
echo "=============================================="
echo ""

cd /root/.openclaw/workspace/projects/memory-collector/tools

# 1. 占位美术
echo "🎨 步骤1/6: 生成占位美术资源..."
python3 generate_placeholder_art.py > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ 占位美术完成"
else
    echo "   ❌ 占位美术失败"
fi

# 2. 卡牌
echo "🃏 步骤2/6: 生成卡牌图片..."
python3 generate_700_cards.py > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ 卡牌生成完成"
else
    echo "   ❌ 卡牌生成失败"
fi

# 3. 音频
echo "🎵 步骤3/6: 生成音频资源..."
python3 generate_audio_simple.py > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ 音频生成完成"
else
    echo "   ❌ 音频生成失败"
fi

# 4. 动画
echo "🎬 步骤4/6: 生成动画帧..."
python3 generate_animations.py > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ 动画生成完成"
else
    echo "   ❌ 动画生成失败"
fi

# 5. 粒子
echo "✨ 步骤5/6: 生成粒子效果..."
python3 generate_particles.py > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ 粒子生成完成"
else
    echo "   ❌ 粒子生成失败"
fi

# 6. 字体
echo "🔤 步骤6/6: 生成位图字体..."
python3 generate_fonts.py > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ 字体生成完成"
else
    echo "   ❌ 字体生成失败"
fi

echo ""
echo "=============================================="
echo "✅ 资源生成完成!"
echo "=============================================="
echo ""

# 统计
cd /root/.openclaw/workspace/projects/memory-collector

IMG_COUNT=$(find assets/images -name "*.png" 2>/dev/null | wc -l)
AUDIO_COUNT=$(find assets/audio -name "*.wav" -o -name "*.ogg" 2>/dev/null | wc -l)
ANIM_FRAMES=$(find assets/animations -name "*.png" 2>/dev/null | wc -l)
PARTICLE_COUNT=$(find assets/particles -name "*.png" 2>/dev/null | wc -l)
FONT_COUNT=$(find assets/fonts -name "*.png" 2>/dev/null | wc -l)

echo "📊 资源统计:"
echo "   🎨 图片资源: $IMG_COUNT"
echo "   🎵 音频资源: $AUDIO_COUNT"
echo "   🎞️ 动画帧: $ANIM_FRAMES"
echo "   ✨ 粒子贴图: $PARTICLE_COUNT"
echo "   🔤 字体图集: $FONT_COUNT"
echo ""
echo "💡 提示: 运行 'git add -A && git commit' 提交新资源"
echo "=============================================="
