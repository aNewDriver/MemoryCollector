# 免Cocos Creator调试方案 - 实施指南

## 方案A: VSCode + Chrome DevTools (立即可用)

### 步骤1: 配置VSCode
已创建 `.vscode/launch.json`，支持：
- F5 启动Chrome调试
- 断点调试TypeScript
- 查看变量和调用栈

### 步骤2: 启动Cocos预览
```bash
# 在Cocos Creator中点击"预览"按钮
# 或命令行启动（如有CLI工具）
```

### 步骤3: 开始调试
1. VSCode按F5
2. 在代码中设置断点
3. Chrome中操作游戏触发断点

---

## 方案B: Node.js + Jest 单元测试 (推荐)

### 步骤1: 安装依赖
```bash
cd /root/.openclaw/workspace/projects/memory-collector
npm install --save-dev jest @types/jest ts-jest
```

### 步骤2: 运行测试
```bash
# 运行所有测试
npm test

# 监听模式（文件修改自动重跑）
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

### 步骤3: 编写测试
在 `tests/` 目录创建测试文件：
```typescript
// tests/battle.test.ts
import { BattleSystem } from '../assets/scripts/battle/BattleSystem';

describe('战斗系统', () => {
    test('伤害计算', () => {
        // 测试代码
    });
});
```

---

## 方案C: 纯浏览器调试 (无需Cocos)

### 架构图
```
┌─────────────────────────────────────────┐
│           浏览器 (Chrome/Firefox)         │
│  ┌─────────────────────────────────────┐ │
│  │     PixiJS 渲染层 (替代Cocos)         │ │
│  │  - 精灵渲染                          │ │
│  │  - 事件处理                          │ │
│  │  - 动画系统                          │ │
│  └─────────────────────────────────────┘ │
│  ┌─────────────────────────────────────┐ │
│  │     游戏核心逻辑 (复用现有代码)         │ │
│  │  - BattleSystem                      │ │
│  │  - CardData                          │ │
│  │  - GameManager                       │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 实施步骤

#### 1. 创建适配层
```typescript
// adapters/PixiAdapter.ts
// 将Cocos API映射到PixiJS
```

#### 2. 创建独立HTML
```bash
mkdir -p debug-browser
touch debug-browser/index.html
```

#### 3. 启动本地服务器
```bash
cd debug-browser
python3 -m http.server 8080
# 访问 http://localhost:8080
```

---

## 方案对比

| 方案 | 启动速度 | 调试能力 | 适用场景 | 复杂度 |
|------|----------|----------|----------|--------|
| VSCode+Chrome | 中 | 强 | 日常开发 | 低 |
| Jest单元测试 | 极快 | 中 | 逻辑验证 | 低 |
| 纯浏览器 | 快 | 强 | 快速迭代 | 中 |
| Cocos原生 | 慢 | 强 | 最终调试 | - |

---

## 推荐工作流

```
1. 开发新功能
   ├── 先写Jest测试 (TDD)
   ├── 在VSCode中断点调试
   └── 最后Cocos中验证效果

2. 修复Bug
   ├── Jest复现问题
   ├── 修复代码
   └── 测试通过 → Cocos验证

3. 性能优化
   ├── Chrome DevTools分析
   ├── 纯浏览器方案快速验证
   └── Cocos真机测试
```

---

## 下一步行动

1. [ ] 安装Jest依赖并配置
2. [ ] 编写首个单元测试 (BattleSystem)
3. [ ] 验证VSCode调试配置
4. [ ] 创建纯浏览器调试原型

**预计时间**: 2-3小时完成基础搭建
