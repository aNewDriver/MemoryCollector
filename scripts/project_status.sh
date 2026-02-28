#!/bin/bash
# 游戏项目状态检查脚本 - 增强版
# 每小时运行，检查项目状态并生成报告

cd /root/.openclaw/workspace/projects/memory-collector

echo "📊 《记忆回收者》项目状态检查"
echo "检查时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 代码统计
echo "💻 代码统计:"
TS_COUNT=$(find assets/scripts -name '*.ts' 2>/dev/null | wc -l)
TS_LINES=$(find assets/scripts -name '*.ts' -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}')
echo "  - TypeScript 文件: ${TS_COUNT} 个"
echo "  - 总代码行数: ${TS_LINES} 行"
echo ""

# 资源统计
echo "🎨 资源统计:"
CARD_IMGS=$(ls assets/resources/images/cards/*.bmp 2>/dev/null | wc -l)
UI_IMGS=$(ls assets/resources/images/ui/*.bmp 2>/dev/null | wc -l)
ICON_IMGS=$(ls assets/resources/images/icons/*.bmp 2>/dev/null | wc -l)
EQ_IMGS=$(ls assets/resources/images/equipment/*.bmp 2>/dev/null | wc -l)
TOTAL_IMGS=$((CARD_IMGS + UI_IMGS + ICON_IMGS + EQ_IMGS))
echo "  - 角色卡牌: ${CARD_IMGS} 张"
echo "  - UI元素: ${UI_IMGS} 张"
echo "  - 功能图标: ${ICON_IMGS} 张"
echo "  - 装备图标: ${EQ_IMGS} 张"
echo "  - 总计: ${TOTAL_IMGS} 张图片"
echo ""

# Git状态
echo "📦 Git状态:"
if git rev-parse --git-dir > /dev/null 2>&1; then
    GIT_STATUS=$(git status --short)
    if [ -z "$GIT_STATUS" ]; then
        echo "  - 状态: 已初始化，工作区干净 ✅"
    else
        echo "  - 状态: 有未提交更改"
        echo "$GIT_STATUS" | head -3
    fi
    COMMIT_COUNT=$(git rev-list --count HEAD 2>/dev/null || echo "0")
    LATEST_COMMIT=$(git log -1 --pretty=format:"%h - %s (%ar)" 2>/dev/null)
    echo "  - 提交次数: ${COMMIT_COUNT}"
    echo "  - 最新提交: ${LATEST_COMMIT}"
else
    echo "  - 状态: 未初始化 ❌"
fi
echo ""

# 远程仓库
echo "☁️ 远程仓库:"
REMOTE_URL=$(git remote get-url origin 2>/dev/null)
if [ -n "$REMOTE_URL" ]; then
    echo "  - 地址: ${REMOTE_URL}"
    # 检查是否有未推送的提交
    UNPUSHED=$(git log origin/master..HEAD --oneline 2>/dev/null | wc -l)
    if [ "$UNPUSHED" -gt 0 ]; then
        echo "  - 未推送提交: ${UNPUSHED} 个"
    else
        echo "  - 同步状态: 已是最新 ✅"
    fi
else
    echo "  - 未配置远程仓库"
fi
echo ""

# 关键文件检查
echo "✅ 关键文件检查:"
KEY_FILES=(
    "assets/scripts/core/GameManager.ts:游戏主控制器"
    "assets/scripts/battle/BattleSystem.ts:战斗系统"
    "assets/scripts/data/CardDatabase.ts:卡牌数据库"
    "docs/GDD.md:游戏设计文档"
    "docs/Art_Prompts.md:AI美术Prompt"
)
for item in "${KEY_FILES[@]}"; do
    file="${item%%:*}"
    name="${item##*:}"
    if [ -f "$file" ]; then
        echo "  ✓ ${name}"
    else
        echo "  ✗ ${name} (缺失)"
    fi
done

echo ""
echo "=========================================="
echo "项目可直接用 Cocos Creator 3.8+ 打开运行"
echo "=========================================="
