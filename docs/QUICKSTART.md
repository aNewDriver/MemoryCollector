# 快速开始

## 环境要求

- Cocos Creator 3.8.0 或更高版本
- Node.js 18 或更高版本

## 打开项目

1. 启动 Cocos Creator
2. 选择「打开项目」
3. 选择 `projects/memory-collector` 文件夹

## 项目结构

```
memory-collector/
├── assets/
│   ├── scenes/          # 场景文件
│   │   └── MainScene.scene    # 主场景
│   ├── prefabs/         # 预制体（待创建）
│   ├── resources/       # 动态加载资源
│   │   ├── images/      # 图片资源
│   │   ├── audio/       # 音频资源
│   │   └── fonts/       # 字体资源
│   └── scripts/         # TypeScript 脚本（已完成）
├── docs/                # 文档
└── project.json         # 项目配置
```

## 下一步操作

### 1. 创建 UI 预制体

需要创建以下预制体：

| 预制体名称 | 用途 |
|-----------|------|
| `BottomNav` | 底部导航栏（5个按钮） |
| `LevelNode` | 关卡节点（探险场景） |
| `FloorItem` | 爬塔楼层项 |
| `CardSlot` | 卡牌槽位 |
| `EquipmentSlot` | 装备槽位 |
| `HPBar` | 血条 |
| `EnergyBar` | 能量条 |
| `SkillButton` | 技能按钮 |

### 2. 场景搭建

在 MainScene 中创建以下节点：

```
Canvas (750x1334)
├── MainCamera
├── GameManager (挂载 GameManager.ts)
├── SceneRoot
│   ├── CharacterScene
│   ├── CityScene
│   ├── AdventureScene
│   ├── TowerScene
│   └── SettingsScene
├── BattleScene (默认隐藏)
└── BottomNav (底部导航栏)
```

### 3. 资源配置

将以下资源放入对应目录：

**图片资源** (`assets/resources/images/`)
- `cards/` - 卡牌立绘（按 AI_Art_Guide.md 生成）
- `ui/` - UI 界面元素（按钮、边框、背景）
- `icons/` - 图标（技能、装备、材料）

**音频资源** (`assets/resources/audio/`)
- `bgm/` - 背景音乐
- `sfx/` - 音效

### 4. 脚本挂载

将对应脚本挂载到场景节点上：

| 节点 | 脚本 |
|------|------|
| GameManager | `core/GameManager.ts` |
| CharacterScene | `ui/scenes/CharacterScene.ts` |
| CityScene | `ui/scenes/CityScene.ts` |
| AdventureScene | `ui/scenes/AdventureScene.ts` |
| TowerScene | `ui/scenes/TowerScene.ts` |
| SettingsScene | `ui/scenes/SettingsScene.ts` |
| BattleScene | `ui/scenes/BattleScene.ts` |
| BottomNav | `ui/BottomNavigation.ts` |

## 构建发布

### 微信小游戏

1. 菜单栏 → 项目 → 构建发布
2. 发布平台选择「微信小游戏」
3. 设置 AppID
4. 点击「构建」
5. 用微信开发者工具打开构建目录

### Android/iOS

1. 菜单栏 → 项目 → 构建发布
2. 选择对应平台
3. 构建后用 Android Studio/Xcode 打开原生工程

## 开发建议

1. **先完成 UI 框架** - 用占位图先跑通所有界面切换
2. **逐步替换美术资源** - 先用色块代替，再替换成 AI 生成的图
3. **优先实现核心循环** - 战斗→养成→抽卡→再战斗
4. **测试优先** - 每个系统完成后进行单元测试

## 代码统计

- TypeScript 文件：26 个
- 核心系统：11 个
- UI 控制器：7 个
- 总代码行数：约 8000+ 行

## 参考资料

- [GDD.md](./GDD.md) - 游戏设计文档
- [AI_Art_Guide.md](./AI_Art_Guide.md) - AI 美术生成指南
