# 记忆回收者 - 业界方案对比与改进计划

## 1. 卡牌游戏业界优秀方案调研

### 1.1 知名卡牌游戏技术栈对比

| 游戏 | 引擎 | 特色技术 | 可借鉴点 |
|------|------|----------|----------|
| **炉石传说** | Unity + 自研框架 | 动态卡牌3D翻转、粒子特效系统 | 卡牌动画状态机、特效层级管理 |
| **原神（七圣召唤）** | Unity | 物理驱动的卡牌交互、PBR材质 | 光影效果、材质系统 |
| **阴阳师** | Unity | Live2D角色、Spine动画 | 2D角色动画方案 |
| **明日方舟** | Unity | 扁平化UI、极简交互 | UI设计模式、响应式布局 |
| **杀戮尖塔** | libGDX (Java) | 纯2D、开源 | 卡牌效果系统架构、Mod支持 |
| **月圆之夜** | Cocos Creator | 竖屏单机卡牌 | 场景管理、资源加载策略 |
| **Astral Chronicles** | Cocos2d-x | 日系卡牌 | 战斗公式设计、数值平衡 |

### 1.2 技术方案对比

#### A. 游戏引擎选择
```
方案                    优点                              缺点
--------------------------------------------------------------------------------
Cocos Creator 3.8+      微信小游戏原生支持、TypeScript     3D能力弱于Unity
Unity 2022+             生态最全、Asset Store资源多        包体大、小游戏支持差
Godot 4.x               开源免费、轻量                     国内生态弱
PixiJS + 自研           极致轻量、完全可控                  开发工作量大
```

**当前选择**: Cocos Creator 3.8+ ✅ 正确，符合微信小游戏定位

#### B. 状态管理方案
```
方案                    适用场景
--------------------------------------------------------------------------------
Redux                   大型项目、复杂数据流
MobX                    中小型项目、响应式编程
自研事件系统             简单项目、性能敏感
GameManager单例          小型项目、快速原型 (当前方案)
```

**建议**: 当前GameManager适合原型阶段，后期可迁移到MobX

#### C. 动画系统
```
方案                    优点                              工具
--------------------------------------------------------------------------------
Spine 2D                专业2D骨骼动画，流畅               Spine编辑器
Live2D                  角色表现力极强                     Live2D Cubism
DragonBones             免费开源，微信内置支持              DragonBones Pro
Cocos Animation         无需额外工具，原生支持              Cocos Editor
程序化动画               资源占用极小，动态生成              代码实现 (当前探索方向)
```

**建议**: 保留程序化动画方案作为备选，正式版使用DragonBones

#### D. 网络架构
```
方案                    延迟      复杂度    适用场景
--------------------------------------------------------------------------------
HTTP REST               高        低        弱联网、回合制
WebSocket               中        中        实时PVP、聊天
长连接TCP               低        高        强实时竞技
帧同步                  极低      极高      格斗、MOBA
```

**当前选择**: HTTP REST + WebSocket ✅ 正确，卡牌游戏不需要极致实时

### 1.3 查漏补缺清单

#### 已确认缺失项（高优先级）
- [ ] **热更新系统** - OTA资源更新，避免整包重装
- [ ] **数据埋点** - 玩家行为分析，优化留存
- [ ] **A/B测试框架** - 数值调优、玩法验证
- [ ] **自动化构建** - CI/CD流水线
- [ ] **性能监控** - FPS、内存、卡顿检测
- [ ] **崩溃上报** - 线上问题追踪

#### 已确认缺失项（中优先级）
- [ ] **多语言本地化** - i18n框架
- [ ] **社交分享** - 微信好友、朋友圈
- [ ] **广告SDK集成** - 激励视频、插屏
- [ ] **支付系统** - 微信内购
- [ ] **GM工具** - 线上运营调试
- [ ] **客服系统** - 工单、反馈

#### 已确认缺失项（低优先级）
- [ ] **Mod支持** - 玩家自定义内容
- [ ] **云存档** - 跨设备同步
- [ ] **成就系统** - Steam/GameCenter
- [ ] **排行榜** - 全球/好友排名

## 2. 免Cocos Creator调试方案

### 2.1 方案一：VSCode + Chrome DevTools (推荐)

```bash
# 1. 安装VSCode插件
# - Cocos Creator DevTools
# - Debugger for Chrome

# 2. 项目配置 launch.json
```

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Cocos Chrome Debug",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:7456",
      "webRoot": "${workspaceFolder}",
      "sourceMaps": true,
      "sourceMapPathOverrides": {
        "assets/*": "${webRoot}/assets/*"
      }
    }
  ]
}
```

**优点**: 官方支持、断点调试、控制台输出
**缺点**: 仍需启动Cocos预览服务

### 2.2 方案二：纯浏览器调试 (无需Cocos)

```typescript
// 创建独立的HTML测试页面
// test-html/index.html
```

```html
<!DOCTYPE html>
<html>
<head>
    <title>Memory Collector - Standalone Test</title>
    <script src="https://cdn.jsdelivr.net/npm/pixi.js@7.x/dist/pixi.min.js"></script>
    <style>
        body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #222; }
        #game { box-shadow: 0 0 20px rgba(0,0,0,0.5); }
    </style>
</head>
<body>
    <div id="game"></div>
    <script type="module">
        // 直接加载游戏逻辑，绕过Cocos
        import { GameCore } from '../assets/scripts/core/GameCore.js';
        
        const app = new PIXI.Application({
            width: 720,
            height: 1280,
            backgroundColor: 0x1a1a2e
        });
        document.getElementById('game').appendChild(app.view);
        
        // 初始化核心游戏逻辑
        const game = new GameCore(app);
        game.init();
    </script>
</body>
</html>
```

**实现步骤**:
1. 提取游戏核心逻辑到纯TypeScript类
2. 使用PixiJS替代Cocos渲染层
3. 浏览器直接打开HTML文件调试

**优点**: 完全无需Cocos Creator、启动极快、热重载方便
**缺点**: 需要额外封装层、部分Cocos API需重写

### 2.3 方案三：Node.js + Jest 单元测试

```typescript
// 纯逻辑测试，完全脱离渲染
// tests/battle.test.ts
```

```typescript
import { BattleSystem } from '../assets/scripts/battle/BattleSystem';
import { Card } from '../assets/scripts/data/CardData';

describe('BattleSystem', () => {
    let battle: BattleSystem;
    
    beforeEach(() => {
        battle = new BattleSystem();
    });
    
    test('should calculate damage correctly', () => {
        const attacker: Card = {
            id: 'test_atk',
            atk: 100,
            element: 'fire'
        };
        
        const defender: Card = {
            id: 'test_def',
            hp: 500,
            def: 50,
            element: 'wood'
        };
        
        const damage = battle.calculateDamage(attacker, defender);
        
        // 火克木，应有30%加成
        expect(damage).toBeGreaterThan(100);
    });
    
    test('should handle element counter', () => {
        const result = battle.checkElementCounter('fire', 'wood');
        expect(result).toBe('advantage');
    });
});
```

**配置 package.json**:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "devDependencies": {
    "@types/jest": "^29.0.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0"
  }
}
```

**优点**: 测试速度快、可CI自动化、TDD开发
**缺点**: 只能测逻辑，无法测UI

### 2.4 方案四：Vite + React/Vue 调试界面

```bash
# 创建独立的调试工具界面
npm create vite@latest debug-tools -- --template vanilla-ts
```

```typescript
// 可视化调试面板
// 用于实时调整数值、查看状态
```

**适用场景**: 数值策划调参、GM工具原型

### 2.5 推荐方案组合

```
开发阶段:
├── 核心逻辑开发 → Node.js + Jest (TDD)
├── UI布局调试 → Cocos Creator (必须)
└── 性能敏感模块 → 纯浏览器PixiJS方案

测试阶段:
├── 单元测试 → Jest自动化
├── 集成测试 → VSCode + Chrome
└── 真机测试 → 微信开发者工具
```

## 3. 下一步行动计划

### 本周（立即执行）
1. [ ] 搭建Jest单元测试框架
2. [ ] 编写BattleSystem核心测试用例
3. [ ] 创建VSCode调试配置

### 下周
1. [ ] 实现纯浏览器调试页面（PixiJS版）
2. [ ] 设计热更新系统架构
3. [ ] 集成数据埋点SDK

### 后续
1. [ ] 搭建CI/CD流水线
2. [ ] 接入性能监控
3. [ ] 实现崩溃上报

---

**参考链接**:
- [Cocos Creator最佳实践](https://docs.cocos.com/creator/manual/zh/editor/publish/publish-wechatgame.html)
- [微信小游戏性能优化](https://developers.weixin.qq.com/minigame/dev/guide/performance/)
- [Jest测试框架](https://jestjs.io/)
- [PixiJS渲染引擎](https://pixijs.com/)
