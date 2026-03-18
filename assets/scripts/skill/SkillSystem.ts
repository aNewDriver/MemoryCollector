/**
 * 技能系统核心
 * 处理技能执行、效果计算、动画触发
 */

import { CardInstance, SkillData, EffectData, EffectType, TargetType, checkElementAdvantage } from '../data/CardData';
import { BattleUnit, TeamType } from '../battle/BattleSystem';
import { audioManager, SFXType } from '../audio/AudioManager';

// 技能执行结果
export interface SkillResult {
    success: boolean;
    caster: string;
    skillId: string;
    targets: SkillTargetResult[];
    message?: string;
}

// 单个目标结果
export interface SkillTargetResult {
    targetId: string;
    damage?: number;
    heal?: number;
    buffsApplied?: BuffResult[];
    debuffsApplied?: DebuffResult[];
    isCrit?: boolean;
    isMiss?: boolean;
}

export interface BuffResult {
    type: EffectType;
    value: number;
    duration: number;
}

export interface DebuffResult {
    type: EffectType;
    value: number;
    duration: number;
}

// 技能上下文
export interface SkillContext {
    caster: BattleUnit;
    targets: BattleUnit[];
    allUnits: BattleUnit[];
    turnCount: number;
}

/**
 * 技能系统
 * 负责技能效果计算和执行
 */
export class SkillSystem {
    
    /**
     * 执行技能
     * @param caster 施法者
     * @param skill 技能数据
     * @param targets 目标单位
     * @param allUnits 所有单位
     * @returns 技能执行结果
     */
    public static executeSkill(
        caster: BattleUnit,
        skill: SkillData,
        targets: BattleUnit[],
        allUnits: BattleUnit[]
    ): SkillResult {
        const context: SkillContext = {
            caster,
            targets,
            allUnits,
            turnCount: 0 // 由BattleSystem设置
        };
        
        const results: SkillTargetResult[] = [];
        
        // 播放技能音效
        audioManager.playSFX(SFXType.SKILL_CAST);
        
        // 处理每个效果
        for (const effect of skill.effects) {
            const effectTargets = this.getEffectTargets(effect, context);
            
            for (const target of effectTargets) {
                const result = this.applyEffect(effect, caster, target, context);
                
                // 合并同一目标的结果
                const existingResult = results.find(r => r.targetId === target.instanceId);
                if (existingResult) {
                    this.mergeResults(existingResult, result);
                } else {
                    results.push({
                        targetId: target.instanceId,
                        ...result
                    });
                }
            }
        }
        
        // 设置冷却
        caster.skillCooldowns.set(skill.id, skill.cooldown);
        
        return {
            success: true,
            caster: caster.instanceId,
            skillId: skill.id,
            targets: results
        };
    }
    
    /**
     * 获取效果的目标
     */
    private static getEffectTargets(effect: EffectData, context: SkillContext): BattleUnit[] {
        const { caster, targets, allUnits } = context;
        
        switch (effect.target) {
            case TargetType.SELF:
                return [caster];
                
            case TargetType.SINGLE_ENEMY:
                return targets.filter(t => t.team !== caster.team && !t.isDead).slice(0, 1);
                
            case TargetType.ALL_ENEMIES:
                return allUnits.filter(t => t.team !== caster.team && !t.isDead);
                
            case TargetType.SINGLE_ALLY:
                return targets.filter(t => t.team === caster.team && !t.isDead).slice(0, 1);
                
            case TargetType.ALL_ALLIES:
                return allUnits.filter(t => t.team === caster.team && !t.isDead);
                
            case TargetType.FRONT_ROW:
                return allUnits.filter(t => t.team !== caster.team && t.position < 2 && !t.isDead);
                
            case TargetType.BACK_ROW:
                return allUnits.filter(t => t.team !== caster.team && t.position >= 2 && !t.isDead);
                
            case TargetType.LOWEST_HP:
                const enemies = allUnits.filter(t => t.team !== caster.team && !t.isDead);
                const lowestHp = enemies.sort((a, b) => a.currentHp / a.maxHp - b.currentHp / b.maxHp)[0];
                return lowestHp ? [lowestHp] : [];
                
            case TargetType.HIGHEST_ATK:
                const enemyUnits = allUnits.filter(t => t.team !== caster.team && !t.isDead);
                const highestAtk = enemyUnits.sort((a, b) => b.stats.atk - a.stats.atk)[0];
                return highestAtk ? [highestAtk] : [];
                
            default:
                return targets;
        }
    }
    
    /**
     * 应用效果
     */
    private static applyEffect(
        effect: EffectData,
        caster: BattleUnit,
        target: BattleUnit,
        context: SkillContext
    ): Partial<SkillTargetResult> {
        
        // 检查命中率
        if (effect.chance && Math.random() * 100 > effect.chance) {
            return { isMiss: true };
        }
        
        switch (effect.type) {
            case EffectType.DAMAGE:
                return this.applyDamageEffect(effect, caster, target, context);
                
            case EffectType.HEAL:
                return this.applyHealEffect(effect, caster, target, context);
                
            case EffectType.BUFF_ATK:
            case EffectType.BUFF_DEF:
            case EffectType.BUFF_SPD:
                return this.applyBuff(effect, target);
                
            case EffectType.DEBUFF_ATK:
            case EffectType.DEBUFF_DEF:
                return this.applyDebuff(effect, target);
                
            case EffectType.BURN:
            case EffectType.POISON:
                return this.applyDotEffect(effect, target);
                
            case EffectType.STUN:
                return this.applyStunEffect(effect, target);
                
            case EffectType.SHIELD:
                return this.applyShieldEffect(effect, target);
                
            case EffectType.CLEANSE:
                return this.applyCleanseEffect(target);
                
            case EffectType.DISPEL:
                return this.applyDispelEffect(target);
                
            default:
                return {};
        }
    }
    
    /**
     * 应用伤害效果
     */
    private static applyDamageEffect(
        effect: EffectData,
        caster: BattleUnit,
        target: BattleUnit,
        context: SkillContext
    ): Partial<SkillTargetResult> {
        // 基础伤害 = 攻击力 * 技能倍率
        let damage = caster.stats.atk * (effect.value / 100);
        
        // 防御减免
        const defenseReduction = target.stats.def / (target.stats.def + 200);
        damage *= (1 - defenseReduction);
        
        // 暴击判定
        const isCrit = Math.random() * 100 < caster.stats.crt;
        if (isCrit) {
            damage *= (caster.stats.cdmg / 100);
        }
        
        // 元素克制
        const elementAdvantage = checkElementAdvantage(caster.element, target.element);
        if (elementAdvantage === 1) {
            damage *= 1.3; // 克制 +30%
        } else if (elementAdvantage === -1) {
            damage *= 0.7; // 被克制 -30%
        }
        
        // 增益/减益影响
        const atkBuff = caster.buffs.find(b => b.type === EffectType.BUFF_ATK);
        if (atkBuff) damage *= (1 + atkBuff.value / 100);
        
        const defDebuff = target.debuffs.find(d => d.type === EffectType.DEBUFF_DEF);
        if (defDebuff) damage *= (1 + defDebuff.value / 100);
        
        // 随机浮动 ±5%
        damage *= (0.95 + Math.random() * 0.1);
        
        damage = Math.floor(damage);
        
        // 应用伤害
        this.dealDamage(target, damage);
        
        // 记录伤害
        caster.damageDealt += damage;
        target.damageTaken += damage;
        
        return { damage, isCrit };
    }
    
    /**
     * 应用治疗效果
     */
    private static applyHealEffect(
        effect: EffectData,
        caster: BattleUnit,
        target: BattleUnit,
        context: SkillContext
    ): Partial<SkillTargetResult> {
        // 治疗量 = 施法者攻击力 * 治疗倍率 或 目标最大生命值 * 百分比
        let heal = caster.stats.atk * (effect.value / 100);
        
        // 治疗增益
        // TODO: 添加治疗增益buff效果
        
        heal = Math.floor(heal);
        
        // 应用治疗
        const actualHeal = this.healTarget(target, heal);
        caster.healingDone += actualHeal;
        
        return { heal: actualHeal };
    }
    
    /**
     * 应用增益效果
     */
    private static applyBuff(effect: EffectData, target: BattleUnit): Partial<SkillTargetResult> {
        const buff = {
            id: `${effect.type}_${Date.now()}`,
            type: effect.type,
            value: effect.value,
            duration: effect.duration || 2,
            source: target.instanceId
        };
        
        target.buffs.push(buff);
        
        return {
            buffsApplied: [{
                type: effect.type,
                value: effect.value,
                duration: effect.duration || 2
            }]
        };
    }
    
    /**
     * 应用减益效果
     */
    private static applyDebuff(effect: EffectData, target: BattleUnit): Partial<SkillTargetResult> {
        // 效果抵抗判定
        const resistChance = target.stats.res;
        if (Math.random() * 100 < resistChance) {
            return { isMiss: true }; // 抵抗成功
        }
        
        const debuff = {
            id: `${effect.type}_${Date.now()}`,
            type: effect.type,
            value: effect.value,
            duration: effect.duration || 2,
            source: target.instanceId
        };
        
        target.debuffs.push(debuff);
        
        return {
            debuffsApplied: [{
                type: effect.type,
                value: effect.value,
                duration: effect.duration || 2
            }]
        };
    }
    
    /**
     * 应用持续伤害效果
     */
    private static applyDotEffect(effect: EffectData, target: BattleUnit): Partial<SkillTargetResult> {
        const debuff = {
            id: `${effect.type}_${Date.now()}`,
            type: effect.type,
            value: effect.value, // 每回合伤害值或百分比
            duration: effect.duration || 3,
            source: target.instanceId
        };
        
        target.debuffs.push(debuff);
        
        return {
            debuffsApplied: [{
                type: effect.type,
                value: effect.value,
                duration: effect.duration || 3
            }]
        };
    }
    
    /**
     * 应用眩晕效果
     */
    private static applyStunEffect(effect: EffectData, target: BattleUnit): Partial<SkillTargetResult> {
        // 效果抵抗判定
        const resistChance = target.stats.res;
        if (Math.random() * 100 < resistChance) {
            return { isMiss: true };
        }
        
        const debuff = {
            id: `${EffectType.STUN}_${Date.now()}`,
            type: EffectType.STUN,
            value: 0,
            duration: effect.duration || 1,
            source: target.instanceId
        };
        
        target.debuffs.push(debuff);
        target.isStunned = true;
        
        return {
            debuffsApplied: [{
                type: EffectType.STUN,
                value: 0,
                duration: effect.duration || 1
            }]
        };
    }
    
    /**
     * 应用护盾效果
     */
    private static applyShieldEffect(effect: EffectData, target: BattleUnit): Partial<SkillTargetResult> {
        const shield = {
            id: `${EffectType.SHIELD}_${Date.now()}`,
            type: EffectType.SHIELD,
            value: effect.value, // 护盾值
            duration: effect.duration || 2,
            source: target.instanceId
        };
        
        // 检查是否已有护盾，叠加
        const existingShield = target.buffs.find(b => b.type === EffectType.SHIELD);
        if (existingShield) {
            existingShield.value += effect.value;
        } else {
            target.buffs.push(shield);
        }
        
        return {
            buffsApplied: [{
                type: EffectType.SHIELD,
                value: effect.value,
                duration: effect.duration || 2
            }]
        };
    }
    
    /**
     * 净化效果 - 移除所有减益
     */
    private static applyCleanseEffect(target: BattleUnit): Partial<SkillTargetResult> {
        const removedDebuffs = target.debuffs.map(d => ({
            type: d.type,
            value: d.value,
            duration: 0
        }));
        
        target.debuffs = [];
        target.isStunned = false;
        
        return { buffsApplied: removedDebuffs };
    }
    
    /**
     * 驱散效果 - 移除所有增益
     */
    private static applyDispelEffect(target: BattleUnit): Partial<SkillTargetResult> {
        const removedBuffs = target.buffs.map(b => ({
            type: b.type,
            value: b.value,
            duration: 0
        }));
        
        target.buffs = [];
        
        return { debuffsApplied: removedBuffs };
    }
    
    /**
     * 造成伤害
     */
    private static dealDamage(target: BattleUnit, damage: number): void {
        // 护盾优先吸收
        const shield = target.buffs.find(b => b.type === EffectType.SHIELD);
        if (shield && shield.value > 0) {
            if (shield.value >= damage) {
                shield.value -= damage;
                damage = 0;
            } else {
                damage -= shield.value;
                shield.value = 0;
            }
        }
        
        target.currentHp -= damage;
        
        if (target.currentHp <= 0) {
            target.currentHp = 0;
            target.isDead = true;
        }
    }
    
    /**
     * 治疗目标
     */
    private static healTarget(target: BattleUnit, amount: number): number {
        const actualHeal = Math.min(amount, target.maxHp - target.currentHp);
        target.currentHp += actualHeal;
        return actualHeal;
    }
    
    /**
     * 合并结果
     */
    private static mergeResults(existing: SkillTargetResult, newResult: Partial<SkillTargetResult>): void {
        if (newResult.damage) {
            existing.damage = (existing.damage || 0) + newResult.damage;
        }
        if (newResult.heal) {
            existing.heal = (existing.heal || 0) + newResult.heal;
        }
        if (newResult.buffsApplied) {
            existing.buffsApplied = [...(existing.buffsApplied || []), ...newResult.buffsApplied];
        }
        if (newResult.debuffsApplied) {
            existing.debuffsApplied = [...(existing.debuffsApplied || []), ...newResult.debuffsApplied];
        }
        if (newResult.isCrit !== undefined) {
            existing.isCrit = newResult.isCrit;
        }
        if (newResult.isMiss !== undefined) {
            existing.isMiss = newResult.isMiss;
        }
    }
    
    /**
     * 检查技能是否可用
     */
    public static isSkillAvailable(unit: BattleUnit, skill: SkillData): boolean {
        // 检查冷却
        const cooldown = unit.skillCooldowns.get(skill.id) || 0;
        if (cooldown > 0) return false;
        
        // 检查能量
        if (unit.currentEnergy < skill.cost) return false;
        
        // 检查眩晕状态
        if (unit.isStunned) return false;
        
        return true;
    }
    
    /**
     * 获取技能消耗描述
     */
    public static getSkillCostDescription(skill: SkillData): string {
        if (skill.cost === 0) return '普攻';
        return `消耗 ${skill.cost} 能量`;
    }
    
    /**
     * 获取技能冷却描述
     */
    public static getSkillCooldownDescription(skill: SkillData): string {
        if (skill.cooldown === 0) return '无冷却';
        return `冷却 ${skill.cooldown} 回合`;
    }
}

// 导出单例
export const skillSystem = new SkillSystem();
