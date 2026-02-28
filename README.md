# 记忆回收者 / Memory Collector

一款多端卡牌养成RPG游戏，支持 iOS / Android / 微信小游戏。

## 项目概述

- **类型**：竖屏卡牌养成RPG
- **平台**：iOS / Android / 微信小游戏
- **引擎**：Cocos Creator 3.8+
- **语言**：TypeScript

## 世界观

"大遗忘"事件后的世界，人类的记忆不再自然消逝，而是凝结成实体化的"记忆碎片"。

你是一名"回收者"——被组织派遣到废墟中，收集这些碎片，还原逝者的故事。每张卡牌是一个亡者的残影，养成过程是逐渐还原他们的人生。

## 核心特色

- **深度养成**：等级/突破/技能/亲密度/觉醒 多线养成
- **策略战斗**：回合制5v5，属性克制，技能连携
- **丰富剧情**：每个角色都有完整的背景故事和记忆剧情
- **废土美学**：独特的视觉风格，AI生成统一美术资源

## 项目结构

```
projects/memory-collector/
├── assets/scripts/
│   ├── core/
│   │   ├── GameManager.ts         # 游戏主控制器
│   │   ├── SceneManager.ts        # 场景管理器
│   │   └── EventManager.ts        # 全局事件系统
│   ├── data/
│   │   ├── CardData.ts            # 卡牌数据结构
│   │   ├── CardDatabase.ts        # 卡牌数据库（7张角色）
│   │   └── PlayerData.ts          # 玩家数据+关卡配置
│   ├── battle/
│   │   └── BattleSystem.ts        # 回合制战斗核心
│   ├── growth/
│   │   └── GrowthSystem.ts        # 养成系统（等级/突破/觉醒）
│   ├── gacha/
│   │   └── GachaSystem.ts         # 抽卡系统（保底机制）
│   ├── shop/
│   │   └── ShopSystem.ts          # 商店系统
│   ├── inventory/
│   │   └── InventorySystem.ts     # 背包+装备系统
│   ├── task/
│   │   └── TaskSystem.ts          # 任务与成就系统
│   ├── audio/
│   │   └── AudioManager.ts        # 音效管理器
│   ├── save/
│   │   └── SaveManager.ts         # 存档管理器
│   ├── utils/
│   │   └── Utils.ts               # 工具函数
│   └── ui/
│       ├── BottomNavigation.ts    # 底部导航栏
│       └── scenes/
│           ├── CharacterScene.ts  # 角色界面
│           ├── CityScene.ts       # 主城界面
│           ├── AdventureScene.ts  # 探险（章节关卡）
│           ├── TowerScene.ts      # 爬塔界面
│           ├── BattleScene.ts     # 战斗界面
│           └── SettingsScene.ts   # 设置界面
├── docs/
│   ├── GDD.md                     # 游戏设计文档
│   └── AI_Art_Guide.md            # AI美术生成指南
└── README.md
```

## 开发进度

### 核心系统（已完成 ✅）
- [x] 核心数据结构定义
- [x] 卡牌数据库（7张初始角色）
- [x] 战斗系统框架（回合制5v5、buff/debuff、能量系统）
- [x] 养成系统框架（等级/突破/技能/亲密度/觉醒）
- [x] 抽卡系统（保底机制、UP池、友情池）
- [x] 商店系统（5分类、限购、刷新）
- [x] 背包+装备系统（6部位、套装、强化）
- [x] 任务与成就系统（每日/每周/主线/成就）
- [x] 音效管理器（BGM/SFX、音量控制）
- [x] 存档系统（本地存储、自动保存、云存档接口）
- [x] 全局事件系统（模块间通信）
- [x] 游戏主控制器（系统初始化、生命周期管理）

### 场景框架（已完成 ✅）
- [x] 5大场景UI控制器（角色/主城/探险/爬塔/设置）
- [x] 战斗场景UI框架
- [x] 章节关卡系统（50关/章，Boss设计）
- [x] 爬塔系统（无上限、特殊规则）
- [x] 底部导航栏

### Cocos Creator 项目配置（已完成 ✅）
- [x] package.json - 项目依赖
- [x] tsconfig.json - TypeScript 配置
- [x] project.json - Cocos 项目配置
- [x] MainScene.scene - 主场景框架
- [x] 快速开始文档

### 待完成
- [ ] UI 预制体（按钮、面板、血条等）
- [ ] 场景节点搭建
- [ ] 战斗场景动画和特效
- [ ] 音效音乐资源
- [ ] AI 美术资源生成
- [ ] 多平台适配测试

## 技术栈

- **游戏引擎**：Cocos Creator 3.8+
- **编程语言**：TypeScript
- **状态管理**：待定（考虑 Redux/MobX 或自研）
- **网络**：Cocos 原生网络模块
- **存储**：LocalStorage / 微信云存储

## 快速开始

### 环境要求
- Cocos Creator 3.8.0+
- Node.js 18+

### 安装步骤

1. 克隆项目
```bash
git clone [项目地址]
cd memory-collector
```

2. 用 Cocos Creator 打开项目
```bash
# 或者在 Cocos Dashboard 中导入项目
```

3. 安装依赖（如果有）
```bash
npm install
```

4. 运行预览
```
Cocos Creator → 预览
```

### 构建发布

1. **微信小游戏**
   - 项目 → 构建发布
   - 选择"微信小游戏"
   - 构建后用微信开发者工具打开

2. **Android/iOS**
   - 项目 → 构建发布
   - 选择对应平台
   - 用 Android Studio / Xcode 打开原生工程

## 角色预览

| 角色 | 元素 | 稀有度 | 定位 |
|------|------|--------|------|
| 烬羽 | 火 | 稀有 | 输出 |
| 青漪 | 水 | 史诗 | 治疗 |
| 逐风 | 风 | 史诗 | 刺客 |
| 岩心 | 土 | 稀有 | 坦克 |
| 明烛 | 光 | 传说 | 辅助 |
| 残影 | 暗 | 神话 | 核心 |

## 美术资源

使用 AI 生成，风格统一为"废土美学+记忆碎片"。

详见 [AI_Art_Guide.md](./docs/AI_Art_Guide.md)

## 贡献指南

这是一个独立游戏项目，目前主要由开发者个人维护。

## 许可证

待定

---

**开发状态**：早期开发阶段
