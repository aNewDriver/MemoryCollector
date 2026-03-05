#!/bin/bash
# 部署记忆回收者手机试玩版到 GitHub Pages

echo "正在部署到 GitHub Pages..."

# 创建临时目录
cd /tmp
rm -rf memory-recycle-deploy
mkdir memory-recycle-deploy
cd memory-recycle-deploy

# 初始化 git
git init
git checkout -b gh-pages

# 复制文件
cp /root/.openclaw/workspace/projects/memory-collector/mobile-demo/* .

# 提交
git add -A
git commit -m "Deploy mobile demo v0.3"

# 推送到 GitHub (需要先在 GitHub 创建仓库)
echo "请先在 GitHub 创建仓库 memory-recycle"
echo "然后运行: git push -f https://github.com/wangke-ios/memory-recycle.git gh-pages"
