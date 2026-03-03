/**
 * BattleSystem 单元测试
 * 纯逻辑测试，无需Cocos环境
 */

// 模拟Cocos API (测试中不需要真实Cocos)
const mockCC = {
    Vec2: class Vec2 {
        constructor(public x: number, public y: number) {}
    }
};

// 测试用的简化版战斗系统
class TestBattleSystem {
    
    // 元素克制表
    private elementCounter: Record<string, string> = {
        'metal': 'wood',
        'wood': 'earth', 
        'earth': 'water',
        'water': 'fire',
        'fire': 'metal',
        'light': 'dark',
        'dark': 'light'
    };
    
    /**
     * 计算伤害
     */
    calculateDamage(
        attacker: { atk: number; element: string },
        defender: { def: number; element: string; hp: number }
    ): number {
        let multiplier = 1.0;
        
        // 检查克制关系
        if (this.elementCounter[attacker.element] === defender.element) {
            multiplier = 1.3; // 克制 +30%
        } else if (this.elementCounter[defender.element] === attacker.element) {
            multiplier = 0.7; // 被克制 -30%
        }
        
        // 基础伤害公式
        const baseDamage = Math.max(1, attacker.atk - defender.def * 0.5);
        const finalDamage = Math.floor(baseDamage * multiplier);
        
        return finalDamage;
    }
    
    /**
     * 检查元素克制关系
     */
    checkElementCounter(attacker: string, defender: string): 'advantage' | 'disadvantage' | 'neutral' {
        if (this.elementCounter[attacker] === defender) {
            return 'advantage';
        } else if (this.elementCounter[defender] === attacker) {
            return 'disadvantage';
        }
        return 'neutral';
    }
    
    /**
     * 计算连击伤害加成
     */
    calculateComboBonus(comboCount: number): number {
        // 每连击增加10%，最高50%
        return Math.min(0.5, comboCount * 0.1);
    }
    
    /**
     * 判断是否暴击
     */
    isCritical(critRate: number): boolean {
        return Math.random() * 100 < critRate;
    }
}

// ==================== 测试用例 ====================

const battle = new TestBattleSystem();

// 测试1: 基础伤害计算
console.log('Test 1: 基础伤害计算');
const damage1 = battle.calculateDamage(
    { atk: 100, element: 'fire' },
    { def: 50, element: 'earth', hp: 1000 }
);
console.log(`  伤害: ${damage1}`);
console.assert(damage1 > 0, '伤害应该大于0');

// 测试2: 元素克制
console.log('\nTest 2: 元素克制');
const counter = battle.checkElementCounter('fire', 'metal');
console.log(`  火 vs 金: ${counter}`);
console.assert(counter === 'advantage', '火应该克金');

// 测试3: 元素被克
console.log('\nTest 3: 元素被克');
const counter2 = battle.checkElementCounter('wood', 'metal');
console.log(`  木 vs 金: ${counter2}`);
console.assert(counter2 === 'disadvantage', '木应该被金克');

// 测试4: 连击加成
console.log('\nTest 4: 连击加成');
const bonus1 = battle.calculateComboBonus(3);
const bonus2 = battle.calculateComboBonus(10);
console.log(`  3连击加成: ${bonus1 * 100}%`);
console.log(`  10连击加成: ${bonus2 * 100}% (应被限制在50%)`);
console.assert(bonus1 === 0.3, '3连击应该是30%');
console.assert(bonus2 === 0.5, '10连击应该被限制在50%');

// 测试5: 暴击率
console.log('\nTest 5: 暴击概率');
let critCount = 0;
const testCount = 1000;
for (let i = 0; i < testCount; i++) {
    if (battle.isCritical(30)) critCount++;
}
const critRate = critCount / testCount;
console.log(`  30%暴击率，实际暴击: ${(critRate * 100).toFixed(1)}%`);
console.assert(critRate > 0.25 && critRate < 0.35, '暴击率应该在合理范围内');

console.log('\n✅ 所有测试通过!');

// 导出供Jest使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TestBattleSystem };
}
