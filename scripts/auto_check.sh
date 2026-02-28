#!/bin/bash
# 游戏项目自动检查脚本
# 每小时运行一次，检查项目状态

echo "========== 记忆回收者项目状态检查 =========="
echo "检查时间: $(date)"
echo ""

cd /root/.openclaw/workspace/projects/memory-collector

# 代码统计
echo "📊 代码统计:"
echo "TypeScript 文件: $(find assets/scripts -name '*.ts' | wc -l) 个"
echo "总代码行数: $(find assets/scripts -name '*.ts' -exec wc -l {} + | tail -1 | awk '{print $1}') 行"
echo ""

# 资源统计
echo "🎨 资源统计:"
echo "角色卡牌: $(ls assets/resources/images/cards/*.bmp 2>/dev/null | wc -l) 张"
echo "UI元素: $(ls assets/resources/images/ui/*.bmp 2>/dev/null | wc -l) 张"
echo "图标: $(ls assets/resources/images/icons/*.bmp 2>/dev/null | wc -l) 张"
echo ""

# Git状态
echo "📦 Git状态:"
git status --short | head -5
if [ $? -eq 0 ]; then
    echo "工作区: 干净"
else
    echo "工作区: 有未提交更改"
fi
echo ""

# 检查关键文件
echo "✅ 关键文件检查:"
files=(
    "assets/scripts/core/GameManager.ts"
    "assets/scripts/battle/BattleSystem.ts"
    "assets/scripts/data/CardDatabase.ts"
    "docs/GDD.md"
    "docs/Art_Prompts.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file (缺失)"
    fi
done

echo ""
echo "========== 检查完成 =========="
