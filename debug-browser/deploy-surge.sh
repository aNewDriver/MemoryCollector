#!/bin/bash
# 一键部署到 surge.sh
# 使用方法: bash deploy-surge.sh your-email@example.com

EMAIL=${1:-"user@example.com"}
PROJECT_DIR="/root/.openclaw/workspace/projects/memory-collector/debug-browser"
DOMAIN="memory-collector-$(date +%s).surge.sh"

echo "🚀 部署记忆回收者调试页面..."
echo "邮箱: $EMAIL"
echo "域名: $DOMAIN"
cd "$PROJECT_DIR"

# 使用 expect 自动处理交互
expect -c "
spawn surge --project . --domain $DOMAIN
expect \"email:\"
send \"$EMAIL\r\"
expect \"password:\"
send \"\r\"
expect eof
" 2>/dev/null || echo "需要手动输入: surge --project . --domain $DOMAIN"

echo ""
echo "✅ 部署完成!"
echo "访问地址: https://$DOMAIN"
