# 部署到 GitHub Pages 指南

## 自动部署（推荐）

已配置 GitHub Actions，推送后自动部署。

### 步骤：

1. 在 GitHub 创建仓库 `memory-collector-debug`
2. 将 `debug-browser` 文件夹推送到仓库
3. 在仓库设置中开启 GitHub Pages
4. 选择 GitHub Actions 作为部署源

### 或者手动部署：

```bash
# 1. 进入调试页面目录
cd debug-browser

# 2. 初始化Git仓库
git init
git add .
git commit -m "Initial commit"

# 3. 推送到GitHub（替换为你的用户名）
git remote add origin https://github.com/你的用户名/memory-collector-debug.git
git push -u origin main

# 4. 在GitHub仓库设置中开启Pages
# Settings -> Pages -> Source: Deploy from a branch -> main
```

## 在线预览

部署成功后，访问地址：
```
https://你的用户名.github.io/memory-collector-debug/
```

## 本地预览

```bash
cd debug-browser
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080
```

## 功能说明

- ✅ 游戏画布预览
- ✅ 卡牌展示交互
- ✅ 战斗系统实时测试
- ✅ 调试日志系统
- ✅ 完全基于原生Canvas + JavaScript
- ✅ 无需Cocos Creator
