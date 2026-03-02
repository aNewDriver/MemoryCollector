# Cocos Creator 场景配置指南

**项目**: 记忆回收者  
**引擎版本**: Cocos Creator 3.8+  
**创建日期**: 2026-03-03  

---

## 一、项目设置

### 1.1 构建配置

```json
// project.json 关键配置
{
  "name": "memory-collector",
  "version": "1.0.0",
  "creator": {
    "version": "3.8.0"
  },
  "platforms": {
    "web-desktop": {
      "resolution": {
        "width": 1280,
        "height": 720
      }
    },
    "wechatgame": {
      "appid": "YOUR_APP_ID",
      "orientation": "portrait"
    },
    "android": {
      "packageName": "com.yourcompany.memorycollector"
    },
    "ios": {
      "packageName": "com.yourcompany.memorycollector"
    }
  }
}
```

### 1.2 设计分辨率

| 平台 | 设计分辨率 | 适配策略 |
|------|-----------|---------|
| 手机竖屏 | 750 × 1334 | FIT_HEIGHT |
| 手机横屏 | 1334 × 750 | FIT_WIDTH |
| iPad | 1536 × 2048 | SHOW_ALL |
| PC | 1280 × 720 | FIXED_WIDTH |

---

## 二、场景结构

### 2.1 MainScene (主场景)

```
MainScene
├── Canvas (设计分辨率)
│   ├── Background (全屏背景)
│   │   └── Sprite (bg_main.png)
│   ├── TopBar (顶部资源栏)
│   │   ├── GoldIcon
│   │   ├── GoldText
│   │   ├── GemIcon
│   │   ├── GemText
│   │   ├── EnergyIcon
│   │   └── EnergyText
│   ├── PlayerInfo (玩家信息)
│   │   ├── Avatar
│   │   ├── NameText
│   │   └── LevelText
│   ├── MenuGrid (功能菜单网格)
│   │   ├── AdventureBtn (冒险)
│   │   ├── CharacterBtn (角色)
│   │   ├── GachaBtn (抽卡)
│   │   ├── ShopBtn (商店)
│   │   ├── GuildBtn (公会)
│   │   ├── ArenaBtn (竞技场)
│   │   ├── TowerBtn (爬塔)
│   │   └── MailBtn (邮件)
│   ├── BottomBar (底部功能栏)
│   │   ├── BagBtn
│   │   ├── FriendBtn
│   │   ├── SettingsBtn
│   │   └── AchievementBtn
│   └── Notifications (通知提示)
│       └── NotificationPrefab
└── Managers (管理器节点)
    ├── GameManager
    ├── UIManager
    ├── AudioManager
    └── NetworkManager
```

### 2.2 BattleScene (战斗场景)

```
BattleScene
├── Canvas
│   ├── Background
│   │   └── BattleBackground
│   ├── PlayerTeam (己方队伍)
│   │   ├── CharacterSlot_1
│   │   ├── CharacterSlot_2
│   │   ├── CharacterSlot_3
│   │   ├── CharacterSlot_4
│   │   └── CharacterSlot_5
│   ├── EnemyTeam (敌方队伍)
│   │   ├── EnemySlot_1
│   │   ├── EnemySlot_2
│   │   ├── EnemySlot_3
│   │   ├── EnemySlot_4
│   │   └── EnemySlot_5
│   ├── BattleUI (战斗界面)
│   │   ├── RoundInfo (回合信息)
│   │   ├── SkillPanel (技能面板)
│   │   ├── AutoBattleBtn (自动战斗)
│   │   ├── SpeedBtn (加速)
│   │   └── EscapeBtn (逃跑)
│   ├── CharacterInfo (角色信息弹窗)
│   └── BattleLog (战斗日志)
└── EffectLayer (特效层)
    └── ParticleManager
```

### 2.3 GachaScene (抽卡场景)

```
GachaScene
├── Canvas
│   ├── Background
│   ├── GachaMachine (抽卡机)
│   │   ├── MachineAnimation
│   │   └── CardRevealPosition
│   ├── PoolSelect (卡池选择)
│   │   ├── NormalPoolBtn
│   │   ├── LimitedPoolBtn
│   │   └── FriendPoolBtn
│   ├── GachaControls
│   │   ├── SingleDrawBtn
│   │   ├── TenDrawBtn
│   │   └── CurrencyDisplay
│   ├── HistoryBtn (历史记录)
│   └── ProbabilityBtn (概率公示)
└── CardReveal (卡牌展示)
    └── CardAnimation
```

### 2.4 CharacterScene (角色场景)

```
CharacterScene
├── Canvas
│   ├── Background
│   ├── CharacterList (角色列表)
│   │   └── CharacterListView
│   ├── CharacterDetail (角色详情)
│   │   ├── CharacterModel (立绘)
│   │   ├── CharacterName
│   │   ├── CharacterLevel
│   │   ├── CharacterStats (属性)
│   │   ├── SkillList (技能列表)
│   │   └── EquipmentSlots (装备槽)
│   ├── ActionButtons
│   │   ├── LevelUpBtn
│   │   ├── BreakthroughBtn
│   │   ├── AwakenBtn
│   │   └── EquipBtn
│   └── FilterPanel (筛选面板)
```

---

## 三、UI组件规范

### 3.1 按钮规范

```typescript
// Button组件配置
const buttonConfig = {
    transition: Button.Transition.SCALE,
    duration: 0.1,
    zoomScale: 0.95,
    
    // 颜色配置
    normalColor: new Color(255, 255, 255),
    pressedColor: new Color(200, 200, 200),
    hoverColor: new Color(230, 230, 230),
    disabledColor: new Color(100, 100, 100, 128)
};
```

### 3.2 字体规范

| 用途 | 字体 | 大小 | 颜色 |
|------|------|------|------|
| 标题 | Arial Bold | 36px | #FFD700 |
| 正文 | Arial | 24px | #FFFFFF |
| 数字 | DIN Alternate | 28px | #00FF00 |
| 提示 | Arial | 18px | #CCCCCC |
| 警告 | Arial Bold | 24px | #FF4444 |

### 3.3 颜色规范

```typescript
// 主题色
const Colors = {
    PRIMARY: new Color(0, 150, 255),      // 主色
    SECONDARY: new Color(255, 200, 0),    // 次要色
    SUCCESS: new Color(0, 200, 100),      // 成功
    WARNING: new Color(255, 150, 0),      // 警告
    DANGER: new Color(255, 50, 50),       // 危险
    
    // 元素色
    FIRE: new Color(255, 100, 50),        // 火
    WATER: new Color(50, 150, 255),       // 水
    WOOD: new Color(50, 200, 100),        // 木
    METAL: new Color(255, 215, 0),        // 金
    EARTH: new Color(180, 120, 60),       // 土
    LIGHT: new Color(255, 255, 200),      // 光
    DARK: new Color(100, 50, 150)         // 暗
};
```

---

## 四、Prefab规范

### 4.1 角色卡片Prefab

```
CharacterCard.prefab
├── CardBackground (Sprite)
├── ElementIcon (Sprite)
├── RarityFrame (Sprite)
├── CharacterImage (Sprite)
├── NameLabel (Label)
├── LevelLabel (Label)
├── PowerLabel (Label)
└── SelectButton (Button)
```

### 4.2 装备图标Prefab

```
EquipmentIcon.prefab
├── ItemBackground (Sprite)
├── ItemIcon (Sprite)
├── RarityBorder (Sprite)
├── LevelBadge (Node)
│   └── LevelLabel (Label)
└── Button (Button)
```

---

## 五、动画配置

### 5.1 通用动画时长

| 动画类型 | 时长 | 缓动 |
|---------|------|------|
| 按钮点击 | 0.1s | QuadOut |
| 界面打开 | 0.3s | BackOut |
| 界面关闭 | 0.2s | QuadIn |
| 弹窗出现 | 0.25s | ElasticOut |
| 卡牌翻转 | 0.5s | QuadInOut |
| 伤害数字 | 0.8s | QuadOut |

### 5.2 战斗动画

```typescript
// 攻击动画
const attackAnimation = {
    duration: 0.3,
    keyframes: [
        { time: 0, position: [0, 0], scale: [1, 1] },
        { time: 0.15, position: [50, 0], scale: [1.1, 0.9] },
        { time: 0.3, position: [0, 0], scale: [1, 1] }
    ]
};

// 受击动画
const hitAnimation = {
    duration: 0.3,
    keyframes: [
        { time: 0, position: [0, 0], color: '#FFFFFF' },
        { time: 0.1, position: [-20, 0], color: '#FF0000' },
        { time: 0.2, position: [10, 0], color: '#FFFFFF' },
        { time: 0.3, position: [0, 0], color: '#FFFFFF' }
    ]
};
```

---

## 六、资源加载策略

### 6.1 预加载资源

```typescript
// 在场景加载前预加载
@ccclass('PreloadManager')
export class PreloadManager extends Component {
    async preloadResources(): Promise<void> {
        const bundle = await assetManager.loadBundle('main');
        
        // 预加载通用资源
        await Promise.all([
            bundle.preloadDir('textures/ui'),
            bundle.preloadDir('prefabs/common'),
            bundle.preloadDir('audio/sfx/ui')
        ]);
        
        console.log('Preload complete');
    }
}
```

### 6.2 动态加载

```typescript
// 按需加载场景资源
async loadSceneResources(sceneName: string): Promise<void> {
    const bundle = await assetManager.loadBundle(sceneName);
    await bundle.loadDir('textures');
    await bundle.loadDir('prefabs');
}
```

---

## 七、性能优化

### 7.1 渲染优化

- ✅ 使用对象池复用节点
- ✅ 合理设置UI层级，减少Overdraw
- ✅ 纹理打包，减少DrawCall
- ✅ 动态合批静态节点

### 7.2 内存优化

- ✅ 场景切换时释放资源
- ✅ 使用弱引用缓存资源
- ✅ 定期清理未使用资源
- ✅ 控制同时加载资源数量

```typescript
// 对象池管理
export class NodePool {
    private static pools: Map<string, Node[]> = new Map();
    
    static get(prefab: Prefab): Node {
        const name = prefab.name;
        const pool = this.pools.get(name) || [];
        
        if (pool.length > 0) {
            return pool.pop()!;
        }
        
        return instantiate(prefab);
    }
    
    static put(node: Node): void {
        const name = node.name;
        const pool = this.pools.get(name) || [];
        
        if (pool.length < 10) {
            pool.push(node);
            this.pools.set(name, pool);
        } else {
            node.destroy();
        }
    }
}
```

---

*文档完成 - 等待实施*
