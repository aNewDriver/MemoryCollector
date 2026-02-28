/**
 * 游戏数据验证工具
 * 检查配置数据的完整性和一致性
 */

import { CARD_DATABASE, CardData, getAllCards } from '../data/CardDatabase';
import { Rarity } from '../data/CardData';

export class DataValidator {
    
    private errors: string[] = [];
    private warnings: string[] = [];
    
    // 验证所有卡牌数据
    public validateAllCards(): { valid: boolean; errors: string[]; warnings: string[] } {
        this.errors = [];
        this.warnings = [];
        
        const cards = getAllCards();
        
        cards.forEach(card => {
            this.validateCard(card);
        });
        
        // 检查ID唯一性
        this.checkDuplicateIds(cards);
        
        return {
            valid: this.errors.length === 0,
            errors: this.errors,
            warnings: this.warnings
        };
    }
    
    private validateCard(card: CardData) {
        // 必需字段检查
        if (!card.id) this.errors.push(`卡牌缺少ID`);
        if (!card.name) this.errors.push(`卡牌 ${card.id} 缺少名称`);
        if (!card.title) this.warnings.push(`卡牌 ${card.id} 缺少称号`);
        
        // 稀有度检查
        if (card.rarity < Rarity.COMMON || card.rarity > Rarity.MYTH) {
            this.errors.push(`卡牌 ${card.id} 稀有度无效: ${card.rarity}`);
        }
        
        // 属性检查
        if (!card.element) this.errors.push(`卡牌 ${card.id} 缺少元素属性`);
        
        // 立绘路径检查
        if (!card.art?.portrait) this.warnings.push(`卡牌 ${card.id} 缺少头像立绘路径`);
        if (!card.art?.fullbody) this.warnings.push(`卡牌 ${card.id} 缺少全身立绘路径`);
        
        // 技能检查
        if (!card.skills?.normal) this.errors.push(`卡牌 ${card.id} 缺少普通攻击技能`);
        if (!card.skills?.special) this.errors.push(`卡牌 ${card.id} 缺少绝技`);
        
        // 数值检查
        this.validateStats(card);
    }
    
    private validateStats(card: CardData) {
        const stats = card.baseStats;
        if (!stats) {
            this.errors.push(`卡牌 ${card.id} 缺少基础属性`);
            return;
        }
        
        if (stats.hp <= 0) this.warnings.push(`卡牌 ${card.id} 生命值为0或负数`);
        if (stats.atk < 0) this.errors.push(`卡牌 ${card.id} 攻击力为负数`);
        if (stats.def < 0) this.errors.push(`卡牌 ${card.id} 防御力为负数`);
        if (stats.spd <= 0) this.errors.push(`卡牌 ${card.id} 速度无效`);
        
        // 成长系数检查
        const growth = card.growth;
        if (!growth) {
            this.errors.push(`卡牌 ${card.id} 缺少成长系数`);
            return;
        }
        
        if (growth.hp <= 0) this.warnings.push(`卡牌 ${card.id} 生命成长系数异常`);
        if (growth.atk <= 0) this.warnings.push(`卡牌 ${card.id} 攻击成长系数异常`);
    }
    
    private checkDuplicateIds(cards: CardData[]) {
        const ids = new Set<string>();
        cards.forEach(card => {
            if (ids.has(card.id)) {
                this.errors.push(`重复的卡牌ID: ${card.id}`);
            }
            ids.add(card.id);
        });
    }
    
    // 打印验证报告
    public printReport() {
        const result = this.validateAllCards();
        
        console.log('========== 数据验证报告 ==========');
        console.log(`总卡牌数: ${getAllCards().length}`);
        console.log(`错误数: ${result.errors.length}`);
        console.log(`警告数: ${result.warnings.length}`);
        console.log(`验证结果: ${result.valid ? '✅ 通过' : '❌ 失败'}`);
        
        if (result.errors.length > 0) {
            console.log('\n❌ 错误:');
            result.errors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
        }
        
        if (result.warnings.length > 0) {
            console.log('\n⚠️ 警告:');
            result.warnings.forEach((warn, i) => console.log(`  ${i + 1}. ${warn}`));
        }
        
        console.log('=================================');
    }
}

// 单例
export const dataValidator = new DataValidator();

// 如果是直接运行此文件，执行验证
if (typeof window === 'undefined') {
    dataValidator.printReport();
}
