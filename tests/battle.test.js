/**
 * BattleSystem 单元测试 - JavaScript版本
 * 纯逻辑测试，无需Cocos环境
 */

// 测试用的简化版战斗系统
class TestBattleSystem {
    
    constructor() {
        // 元素克制表: 金克木，木克土，土克水，水克火，火克金，光暗互克
        this.elementCounter = {
            'metal': 'wood',
            'wood': 'earth', 
            'earth': 'water',
            'water': 'fire',
            'fire': 'metal',
            'light': 'dark',
            'dark': 'light'
        };
    }
    
    /**
     * 计算伤害
     */
    calculateDamage(attacker, defender) {
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
    checkElementCounter(attacker, defender) {
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
    calculateComboBonus(comboCount) {
        // 每连击增加10%，最高50%
        return Math.min(0.5, comboCount * 0.1);
    }
    
    /**
     * 判断是否暴击
     */
    isCritical(critRate) {
        return Math.random() * 100 < critRate;
    }
}

// ==================== 测试用例 ====================

const battle = new TestBattleSystem();
let passCount = 0;
let failCount = 0;

function assert(condition, message) {
    if (condition) {
        passCount++;
        console.log(`  ✅ ${message}`);
    } else {
        failCount++;
        console.log(`  ❌ ${message}`);
    }
}

console.log('='.repeat(50));
console.log('🎮 记忆回收者 - 战斗系统单元测试');
console.log('='.repeat(50));

// 测试1: 基础伤害计算
console.log('\n📋 Test 1: 基础伤害计算');
const damage1 = battle.calculateDamage(
    { atk: 100, element: 'fire' },
    { def: 50, element: 'earth', hp: 1000 }
);
console.log(`  伤害值: ${damage1}`);
assert(damage1 > 0, '伤害应该大于0');
assert(damage1 === 75, '伤害计算应为75 (100 - 25 = 75)');

// 测试2: 元素克制 - 火克金
console.log('\n📋 Test 2: 元素克制 (火克金)');
const counter = battle.checkElementCounter('fire', 'metal');
console.log(`  火 vs 金: ${counter}`);
assert(counter === 'advantage', '火应该克金');
const damageAdvantage = battle.calculateDamage(
    { atk: 100, element: 'fire' },
    { def: 50, element: 'metal', hp: 1000 }
);
console.log(`  克制伤害: ${damageAdvantage} (应有30%加成)`);
assert(damageAdvantage > 75, '克制时伤害应该更高');

// 测试3: 元素被克 - 木被金克
console.log('\n📋 Test 3: 元素被克 (木被金克)');
const counter2 = battle.checkElementCounter('wood', 'metal');
console.log(`  木 vs 金: ${counter2}`);
assert(counter2 === 'disadvantage', '木应该被金克');
const damageDisadvantage = battle.calculateDamage(
    { atk: 100, element: 'wood' },
    { def: 50, element: 'metal', hp: 1000 }
);
console.log(`  被克伤害: ${damageDisadvantage} (应有30%减成)`);
assert(damageDisadvantage < 75, '被克时伤害应该更低');

// 测试4: 连击加成
console.log('\n📋 Test 4: 连击伤害加成');
const bonus1 = battle.calculateComboBonus(3);
const bonus2 = battle.calculateComboBonus(5);
const bonus3 = battle.calculateComboBonus(10);
console.log(`  3连击: ${(bonus1 * 100).toFixed(0)}%`);
console.log(`  5连击: ${(bonus2 * 100).toFixed(0)}%`);
console.log(`  10连击: ${(bonus3 * 100).toFixed(0)}% (应被限制在50%)`);
assert(Math.abs(bonus1 - 0.3) < 0.001, '3连击应该是30%');
assert(bonus2 === 0.5, '5连击应该是50%');
assert(bonus3 === 0.5, '10连击应该被限制在50%');

// 测试5: 五行循环克制
console.log('\n📋 Test 5: 五行循环克制验证');
const elements = ['metal', 'wood', 'earth', 'water', 'fire'];
for (let i = 0; i < elements.length; i++) {
    const attacker = elements[i];
    const defender = elements[(i + 1) % elements.length];
    const result = battle.checkElementCounter(attacker, defender);
    console.log(`  ${attacker} vs ${defender}: ${result}`);
    assert(result === 'advantage', `${attacker}应该克${defender}`);
}

// 测试6: 暴击概率统计
console.log('\n📋 Test 6: 暴击概率分布');
let critCount = 0;
const testCount = 10000;
for (let i = 0; i < testCount; i++) {
    if (battle.isCritical(30)) critCount++;
}
const critRate = critCount / testCount;
console.log(`  30%暴击率，实际暴击: ${(critRate * 100).toFixed(2)}%`);
assert(critRate > 0.28 && critRate < 0.32, '暴击率应该在28%-32%之间');

// 总结
console.log('\n' + '='.repeat(50));
console.log(`📊 测试结果: ${passCount} 通过, ${failCount} 失败`);
console.log('='.repeat(50));

if (failCount === 0) {
    console.log('🎉 所有测试通过!');
    process.exit(0);
} else {
    console.log('⚠️ 存在失败的测试');
    process.exit(1);
}
