# 测试计划实施文档

**项目**: 记忆回收者  
**日期**: 2026-03-03  
**状态**: 实施中

---

## 一、单元测试

### 1.1 测试框架配置

```typescript
// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    testMatch: ['**/*.test.ts'],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
    ],
    coverageThreshold: {
        global: {
            branches: 60,
            functions: 70,
            lines: 70,
            statements: 70
        }
    }
};
```

### 1.2 核心系统测试

```typescript
// tests/battle/BattleSystem.test.ts
import { BattleSystem } from '../../src/battle/BattleSystem';
import { Character } from '../../src/data/CharacterData';

describe('BattleSystem', () => {
    let battleSystem: BattleSystem;
    
    beforeEach(() => {
        battleSystem = new BattleSystem();
    });
    
    test('should initialize battle correctly', () => {
        const playerTeam = createMockTeam(5);
        const enemyTeam = createMockTeam(5);
        
        battleSystem.initBattle(playerTeam, enemyTeam);
        
        expect(battleSystem.round).toBe(1);
        expect(battleSystem.playerTeam.length).toBe(5);
        expect(battleSystem.enemyTeam.length).toBe(5);
    });
    
    test('should calculate damage with element bonus', () => {
        const attacker = createCharacter({ element: 'fire', atk: 100 });
        const defender = createCharacter({ element: wood, def: 50 });
        
        // 火克木，伤害加成30%
        const damage = battleSystem.calculateDamage(attacker, defender);
        
        expect(damage).toBeGreaterThan(100);
    });
    
    test('should handle battle end when all enemies defeated', () => {
        // 测试战斗结束条件
    });
});
```

```typescript
// tests/gacha/GachaSystem.test.ts
import { GachaSystem } from '../../src/gacha/GachaSystem';

describe('GachaSystem', () => {
    test('should guarantee SSR after 90 pulls', () => {
        const gacha = new GachaSystem();
        let ssrCount = 0;
        
        // 模拟89次抽取
        for (let i = 0; i < 89; i++) {
            const result = gacha.pull();
            if (result.rarity === 'SSR') ssrCount++;
        }
        
        // 第90次必出SSR
        const guaranteed = gacha.pull();
        expect(guaranteed.rarity).toBe('SSR');
    });
    
    test('should respect probability distribution', () => {
        const gacha = new GachaSystem();
        const results = { N: 0, R: 0, SR: 0, SSR: 0 };
        
        // 大量抽取测试概率分布
        for (let i = 0; i < 10000; i++) {
            const card = gacha.pull();
            results[card.rarity]++;
        }
        
        // 验证概率在合理范围内
        expect(results.SSR / 10000).toBeCloseTo(0.028, 1);
    });
});
```

---

## 二、集成测试

### 2.1 API集成测试

```typescript
// tests/api/AuthAPI.test.ts
import request from 'supertest';
import { app } from '../../server/src/app';

describe('Auth API', () => {
    test('POST /api/auth/register - should create new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                password: 'testpass123',
                email: 'test@example.com'
            });
        
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
    });
    
    test('POST /api/auth/login - should authenticate user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'testuser',
                password: 'testpass123'
            });
        
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });
});
```

### 2.2 存档系统测试

```typescript
// tests/save/SaveSystem.test.ts
describe('Save System Integration', () => {
    test('should save and load player data correctly', async () => {
        const saveData = createMockSaveData();
        
        // 保存
        await saveManager.save('user123', saveData);
        
        // 读取
        const loaded = await saveManager.load('user123');
        
        expect(loaded).toEqual(saveData);
    });
    
    test('should handle cloud save conflicts', async () => {
        // 测试云端存档冲突解决
    });
});
```

---

## 三、UI自动化测试

### 3.1 Cocos Creator UI测试

```typescript
// tests/ui/MainScene.test.ts
import { director } from 'cc';

describe('MainScene UI', () => {
    beforeAll(async () => {
        await director.loadScene('MainScene');
    });
    
    test('should display all menu buttons', () => {
        const menuGrid = find('Canvas/MenuGrid');
        expect(menuGrid).toBeTruthy();
        
        const buttons = menuGrid.getComponentsInChildren(Button);
        expect(buttons.length).toBeGreaterThanOrEqual(6);
    });
    
    test('should navigate to BattleScene on adventure click', async () => {
        const adventureBtn = find('Canvas/MenuGrid/AdventureBtn');
        
        adventureBtn.getComponent(Button).click();
        
        await waitForSceneLoad('BattleScene');
        expect(director.getScene().name).toBe('BattleScene');
    });
});
```

---

## 四、性能测试

### 4.1 战斗性能测试

```typescript
// tests/performance/BattlePerformance.test.ts
describe('Battle Performance', () => {
    test('should maintain 30fps during 5v5 battle', async () => {
        const battleSystem = new BattleSystem();
        const frameTimes: number[] = [];
        
        // 监控帧率
        const monitor = setInterval(() => {
            frameTimes.push(game.frameDeltaTime);
        }, 1000);
        
        // 模拟10回合战斗
        for (let i = 0; i < 10; i++) {
            await battleSystem.simulateRound();
        }
        
        clearInterval(monitor);
        
        // 验证平均帧率
        const avgFps = 1000 / (frameTimes.reduce((a, b) => a + b) / frameTimes.length);
        expect(avgFps).toBeGreaterThanOrEqual(30);
    });
    
    test('should handle 700 cards without memory issues', () => {
        const cards = generateCards(700);
        const memoryBefore = getMemoryUsage();
        
        // 加载所有卡牌
        cardDatabase.loadAll(cards);
        
        const memoryAfter = getMemoryUsage();
        const memoryIncrease = memoryAfter - memoryBefore;
        
        // 内存增长应小于100MB
        expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);
    });
});
```

---

## 五、兼容性测试

### 5.1 平台兼容性

| 平台 | 分辨率 | 测试项 | 状态 |
|------|--------|--------|------|
| iOS 17 | 1179×2556 | 触摸响应、性能 | ⬜ |
| iOS 16 | 1170×2532 | 触摸响应、性能 | ⬜ |
| Android 14 | 1080×2400 | 触摸响应、性能 | ⬜ |
| Android 13 | 1080×2400 | 触摸响应、性能 | ⬜ |
| 微信小游戏 | 可变 | SDK集成、分包 | ⬜ |
| Web Desktop | 1280×720 | 键盘鼠标支持 | ⬜ |

### 5.2 浏览器兼容性

| 浏览器 | 版本 | WebGL | 状态 |
|--------|------|-------|------|
| Chrome | 120+ | WebGL 2.0 | ⬜ |
| Safari | 17+ | WebGL 2.0 | ⬜ |
| Firefox | 120+ | WebGL 2.0 | ⬜ |
| Edge | 120+ | WebGL 2.0 | ⬜ |

---

## 六、测试用例清单

### 6.1 功能测试用例

| 模块 | 用例ID | 描述 | 优先级 | 状态 |
|------|--------|------|--------|------|
| 登录 | TC-001 | 正常登录流程 | P0 | ⬜ |
| 登录 | TC-002 | 错误密码提示 | P0 | ⬜ |
| 登录 | TC-003 | 游客登录 | P1 | ⬜ |
| 战斗 | TC-101 | 正常战斗流程 | P0 | ⬜ |
| 战斗 | TC-102 | 元素克制计算 | P0 | ⬜ |
| 战斗 | TC-103 | 技能释放 | P1 | ⬜ |
| 抽卡 | TC-201 | 单抽功能 | P0 | ⬜ |
| 抽卡 | TC-202 | 十连保底 | P0 | ⬜ |
| 抽卡 | TC-203 | 概率公示 | P1 | ⬜ |
| 存档 | TC-301 | 本地存档 | P0 | ⬜ |
| 存档 | TC-302 | 云存档上传 | P1 | ⬜ |
| 存档 | TC-303 | 存档冲突处理 | P1 | ⬜ |

### 6.2 回归测试清单

```markdown
- [ ] 登录/注册/游客登录
- [ ] 主线关卡推进
- [ ] 抽卡系统（保底机制）
- [ ] 卡牌养成（升级/突破/觉醒）
- [ ] 战斗系统（自动/手动）
- [ ] 装备系统（穿戴/强化）
- [ ] 公会系统（加入/捐献）
- [ ] 排行榜（查询/更新）
- [ ] 邮件系统（接收/领取）
- [ ] 充值/支付流程
```

---

## 七、自动化测试配置

### 7.1 GitHub Actions CI

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: test
        ports:
          - 3306:3306
      redis:
        image: redis
        ports:
          - 6379:6379
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
      env:
        DB_HOST: localhost
        REDIS_HOST: localhost
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
```

---

## 八、测试进度跟踪

| 阶段 | 计划日期 | 完成度 | 负责人 |
|------|---------|--------|--------|
| 单元测试编写 | 2026-03-05 | 30% | AI |
| 集成测试编写 | 2026-03-07 | 20% | AI |
| UI自动化测试 | 2026-03-10 | 0% | - |
| 性能测试 | 2026-03-12 | 0% | - |
| 兼容性测试 | 2026-03-15 | 0% | - |

---

*文档创建中 - 测试用例持续补充*
