# 记忆回收者 - 项目快速开始指南

## 环境准备

### 1. 安装 Cocos Creator 3.8+
```bash
# 下载地址
https://www.cocos.com/creator-download

# 安装后打开 Cocos Dashboard
# 导入本项目文件夹
```

### 2. 安装依赖
```bash
cd memory-collector
npm install
```

### 3. 打开项目
```
Cocos Dashboard → 导入项目 → 选择 memory-collector 文件夹
```

## 项目结构

```
memory-collector/
├── assets/
│   ├── scenes/          # 场景文件
│   │   └── MainScene.scene
│   ├── scripts/         # TypeScript脚本
│   │   ├── core/        # 核心系统
│   │   ├── battle/      # 战斗系统
│   │   ├── data/        # 数据定义
│   │   └── ...
│   ├── images/          # 图片资源
│   │   ├── characters/  # 角色立绘
│   │   ├── cards/       # 卡牌图片
│   │   ├── ui/          # UI元素
│   │   └── scenes/      # 场景背景
│   ├── audio/           # 音频资源
│   └── prefabs/         # 预制体
├── docs/                # 文档
├── tools/               # 工具脚本
└── server/              # 后端服务
```

## 快速预览

1. 打开 Cocos Creator
2. 双击 `assets/scenes/MainScene.scene`
3. 点击编辑器上方的「预览」按钮

## 构建发布

### 微信小游戏
```
项目 → 构建发布 → 微信小游戏 → 构建
# 用微信开发者工具打开构建后的 wechatgame 文件夹
```

### Android
```
项目 → 构建发布 → Android → 构建
# 用 Android Studio 打开 native 工程
```

### iOS
```
项目 → 构建发布 → iOS → 构建
# 用 Xcode 打开 native 工程
```

## 资源说明

### 占位资源
项目中包含占位美术和音频资源：
- `assets/images/` - 18张角色立绘 + 403张卡牌 + UI元素
- `assets/audio/` - 27个音频占位文件

### 替换为真实资源

**美术资源：**
```bash
# 使用AI生成工具（需外网API）
python3 tools/auto_generate_art.py

# 或使用占位图生成器
python3 tools/generate_placeholder_art.py
```

**音频资源：**
```bash
# 下载免费音效包
bash tools/download_sfx_auto.sh

# 或手动从 https://kenney.nl/assets 下载
```

## 开发模式

### 本地开发
```bash
# 启动后端服务
cd server
npm install
npm run dev

# 后端运行在 http://localhost:3000
```

### 调试配置
```
Cocos Creator → 项目 → 项目设置 → 服务
- 开启「帧率统计」查看FPS
- 开启「调试绘制」查看碰撞盒
```

## 常见问题

### Q: 预览时黑屏？
A: 检查 MainScene.scene 是否正确加载，尝试重新导入项目。

### Q: TypeScript编译错误？
A: 确保使用 Cocos Creator 3.8+，旧版本可能不支持某些语法。

### Q: 资源丢失？
A: 检查 `assets/images/` 和 `assets/audio/` 目录是否存在。

## 相关文档

- [游戏设计文档](./docs/GDD.md)
- [AI美术生成指南](./docs/AI_Art_Guide.md)
- [后端API文档](./server/README.md)

---

**开发状态**: Alpha阶段，核心系统已完成，资源占位中。
