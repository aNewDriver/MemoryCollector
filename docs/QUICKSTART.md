# 快速开始

## 环境要求

- [Cocos Creator 3.8.0+](https://www.cocos.com/creator-download)
- Node.js 18+
- Git

## 获取项目

```bash
git clone git@gitee.com:wangke-ios/memory-recycle.git
cd memory-recycle
```

## 打开项目

1. 启动 Cocos Creator
2. 点击"打开项目"
3. 选择 `memory-recycle` 文件夹

## 运行预览

### 方式1：编辑器预览（推荐开发用）
- Cocos Creator 顶部点击 ▶️ "预览" 按钮
- 会自动打开浏览器窗口运行游戏

### 方式2：构建发布
```bash
# 在 Cocos Creator 中：
# 项目 → 构建发布 → 选择平台 → 构建
```

**推荐构建顺序：**
1. **Web Mobile** - 浏览器测试最快
2. **微信小游戏** - 用微信开发者工具打开
3. **Android/iOS** - 生成原生工程后用 Android Studio/Xcode 编译

## 项目结构

```
assets/
├── scenes/           # 场景文件
│   └── MainScene.scene
├── scripts/          # TypeScript代码（已全部完成）
│   ├── core/         # 核心系统
│   ├── data/         # 数据定义
│   ├── battle/       # 战斗系统
│   ├── growth/       # 养成系统
│   ├── gacha/        # 抽卡系统
│   ├── shop/         # 商店系统
│   ├── inventory/    # 背包系统
│   ├── task/         # 任务系统
│   ├── audio/        # 音效管理
│   ├── save/         # 存档系统
│   ├── utils/        # 工具函数
│   └── ui/           # UI组件
├── prefabs/          # 预制体（需要创建）
└── resources/        # 资源文件（需要添加）
    ├── images/
    ├── audio/
    └── fonts/

docs/                 # 文档
├── GDD.md           # 游戏设计文档
├── AI_Art_Guide.md  # AI美术指南
├── Art_Prompts.md   # 角色生成Prompt
└── Audio_Assets.md  # 音效资源清单
```

## 接下来做什么

### 1. 生成美术资源（推荐先做）

使用 `docs/Art_Prompts.md` 中的Prompt：
- 复制到 Midjourney 或 Stable Diffusion
- 生成6个角色的立绘
- 保存到 `assets/resources/images/cards/`

### 2. 创建UI预制体

在 Cocos Creator 中：
- 创建按钮预制体（使用 CommonButton.ts）
- 创建血条预制体（使用 HealthBar.ts）
- 创建卡牌展示预制体（使用 CardDisplay.ts）
- 创建弹窗预制体（使用 PopupManager.ts）

### 3. 搭建场景

- 打开 `MainScene.scene`
- 拖拽预制体到场景中
- 绑定脚本组件

### 4. 准备音效

按 `docs/Audio_Assets.md` 清单：
- 准备或购买音效文件
- 放到 `assets/resources/audio/`

## 常见问题

### Q: 编译报错找不到模块？
A: 确保 TypeScript 版本正确，尝试重启 Cocos Creator

### Q: 资源加载失败？
A: 检查资源路径是否与代码中一致，注意大小写

### Q: 如何调试？
A: 
- 浏览器预览：按 F12 打开开发者工具
- Cocos Creator：使用 Console 面板查看日志

## 开发建议

1. **先跑通流程**：不用等美术，先用占位图把功能跑通
2. **逐步替换**：功能OK后再替换正式资源
3. **多测试**：每个功能做完后在模拟器测试
4. **及时提交**：定期 `git commit` 保存进度

## 需要帮助？

- 查看 `docs/GDD.md` 了解游戏设计
- 查看 `docs/AI_Art_Guide.md` 了解美术风格
- 代码注释完整，直接阅读源码了解实现
