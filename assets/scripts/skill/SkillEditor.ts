/**
 * SkillEditor
 * Cocos Creator 技能编辑器工具
 * 提供可视化技能配置界面
 */

import { _decorator, Component, property, CCInteger, CCFloat, CCString, CCBoolean, Enum } from 'cc';
import { EffectType, TargetType, ElementType } from '../data/CardData';

const { ccclass } = _decorator;

/**
 * 技能效果配置
 * 用于编辑器中配置技能效果
 */
@ccclass('SkillEffectConfig')
export class SkillEffectConfig {
    @property({
        type: Enum(EffectType),
        tooltip: '效果类型'
    })
    type: EffectType = EffectType.DAMAGE;
    
    @property({
        type: Enum(TargetType),
        tooltip: '目标类型'
    })
    target: TargetType = TargetType.SINGLE_ENEMY;
    
    @property({
        type: CCInteger,
        tooltip: '效果数值（伤害百分比、治疗量等）'
    })
    value: number = 100;
    
    @property({
        type: CCInteger,
        tooltip: '持续回合数（用于buff/debuff）'
    })
    duration: number = 0;
    
    @property({
        type: CCInteger,
        range: [0, 100],
        tooltip: '触发概率（0-100）'
    })
    chance: number = 100;
}

/**
 * 技能编辑器
 * 挂载在技能配置节点上，用于可视化编辑技能
 */
@ccclass('SkillEditor')
export class SkillEditor extends Component {
    
    // ========== 基础信息 ==========
    
    @property({
        type: CCString,
        tooltip: '技能ID（唯一标识）'
    })
    skillId: string = '';
    
    @property({
        type: CCString,
        tooltip: '技能名称'
    })
    skillName: string = '';
    
    @property({
        type: CCString,
        tooltip: '技能描述'
    })
    description: string = '';
    
    @property({
        type: CCString,
        tooltip: '技能图标路径'
    })
    iconPath: string = 'textures/skills/default';
    
    // ========== 消耗与冷却 ==========
    
    @property({
        type: CCInteger,
        range: [0, 100],
        tooltip: '能量消耗'
    })
    cost: number = 0;
    
    @property({
        type: CCInteger,
        range: [0, 10],
        tooltip: '冷却回合数'
    })
    cooldown: number = 0;
    
    // ========== 效果列表 ==========
    
    @property({
        type: [SkillEffectConfig],
        tooltip: '技能效果列表'
    })
    effects: SkillEffectConfig[] = [];
    
    // ========== 动画配置 ==========
    
    @property({
        type: CCString,
        tooltip: '施法动画名称'
    })
    castAnimation: string = 'skill_cast';
    
    @property({
        type: CCString,
        tooltip: '技能特效预制体路径'
    })
    effectPrefab: string = '';
    
    @property({
        type: CCString,
        tooltip: '音效ID'
    })
    soundEffect: string = 'skill_cast';
    
    // ========== 高级配置 ==========
    
    @property({
        type: CCBoolean,
        tooltip: '是否可被闪避'
    })
    canDodge: boolean = true;
    
    @property({
        type: CCBoolean,
        tooltip: '是否可暴击'
    })
    canCrit: boolean = true;
    
    @property({
        type: Enum(ElementType),
        tooltip: '技能元素属性（留空则使用角色属性）'
    })
    element: ElementType | null = null;
    
    // ========== 编辑器功能 ==========
    
    /**
     * 生成技能数据JSON
     */
    public generateSkillData(): object {
        return {
            id: this.skillId,
            name: this.skillName,
            description: this.description,
            icon: this.iconPath,
            cost: this.cost,
            cooldown: this.cooldown,
            effects: this.effects.map(e => ({
                type: e.type,
                target: e.target,
                value: e.value,
                duration: e.duration,
                chance: e.chance
            })),
            animation: this.castAnimation,
            effectPrefab: this.effectPrefab,
            soundEffect: this.soundEffect,
            canDodge: this.canDodge,
            canCrit: this.canCrit,
            element: this.element
        };
    }
    
    /**
     * 验证技能配置
     */
    public validate(): string[] {
        const errors: string[] = [];
        
        if (!this.skillId) {
            errors.push('技能ID不能为空');
        }
        
        if (!this.skillName) {
            errors.push('技能名称不能为空');
        }
        
        if (this.effects.length === 0) {
            errors.push('至少需要配置一个效果');
        }
        
        for (let i = 0; i < this.effects.length; i++) {
            const effect = this.effects[i];
            if (effect.value < 0) {
                errors.push(`效果[${i}]数值不能为负数`);
            }
            if (effect.chance < 0 || effect.chance > 100) {
                errors.push(`效果[${i}]概率必须在0-100之间`);
            }
        }
        
        return errors;
    }
    
    /**
     * 获取技能描述文本（自动根据效果生成）
     */
    public getAutoDescription(): string {
        if (this.description) return this.description;
        
        // 根据效果自动生成描述
        const parts: string[] = [];
        
        for (const effect of this.effects) {
            let desc = '';
            
            switch (effect.type) {
                case EffectType.DAMAGE:
                    desc = `造成 ${effect.value}% 攻击力的伤害`;
                    break;
                case EffectType.HEAL:
                    desc = `恢复 ${effect.value}% 攻击力的生命值`;
                    break;
                case EffectType.BUFF_ATK:
                    desc = `攻击力提升 ${effect.value}%，持续 ${effect.duration} 回合`;
                    break;
                case EffectType.BUFF_DEF:
                    desc = `防御力提升 ${effect.value}%，持续 ${effect.duration} 回合`;
                    break;
                case EffectType.BUFF_SPD:
                    desc = `速度提升 ${effect.value}%，持续 ${effect.duration} 回合`;
                    break;
                case EffectType.DEBUFF_ATK:
                    desc = `降低目标 ${effect.value}% 攻击力，持续 ${effect.duration} 回合`;
                    break;
                case EffectType.DEBUFF_DEF:
                    desc = `降低目标 ${effect.value}% 防御力，持续 ${effect.duration} 回合`;
                    break;
                case EffectType.BURN:
                    desc = `使目标燃烧，每回合受到 ${effect.value} 伤害，持续 ${effect.duration} 回合`;
                    break;
                case EffectType.POISON:
                    desc = `使目标中毒，每回合受到 ${effect.value} 伤害，持续 ${effect.duration} 回合`;
                    break;
                case EffectType.STUN:
                    desc = `有 ${effect.chance}% 概率眩晕目标 ${effect.duration} 回合`;
                    break;
                case EffectType.SHIELD:
                    desc = `为目标添加 ${effect.value} 点护盾，持续 ${effect.duration} 回合`;
                    break;
                case EffectType.CLEANSE:
                    desc = '净化所有减益效果';
                    break;
                case EffectType.DISPEL:
                    desc = '驱散目标所有增益效果';
                    break;
                default:
                    desc = '未知效果';
            }
            
            parts.push(desc);
        }
        
        return parts.join('；');
    }
    
    /**
     * 复制技能配置
     */
    public cloneConfig(): SkillEditor {
        const clone = new SkillEditor();
        clone.skillId = this.skillId + '_copy';
        clone.skillName = this.skillName + ' (复制)';
        clone.description = this.description;
        clone.iconPath = this.iconPath;
        clone.cost = this.cost;
        clone.cooldown = this.cooldown;
        clone.effects = this.effects.map(e => {
            const ne = new SkillEffectConfig();
            ne.type = e.type;
            ne.target = e.target;
            ne.value = e.value;
            ne.duration = e.duration;
            ne.chance = e.chance;
            return ne;
        });
        clone.castAnimation = this.castAnimation;
        clone.effectPrefab = this.effectPrefab;
        clone.soundEffect = this.soundEffect;
        return clone;
    }
    
    // ========== 预设模板 ==========
    
    /**
     * 创建普攻模板
     */
    public static createNormalAttackTemplate(): SkillEditor {
        const editor = new SkillEditor();
        editor.skillId = 'skill_normal_atk';
        editor.skillName = '普通攻击';
        editor.cost = 0;
        editor.cooldown = 0;
        
        const effect = new SkillEffectConfig();
        effect.type = EffectType.DAMAGE;
        effect.target = TargetType.SINGLE_ENEMY;
        effect.value = 100;
        editor.effects = [effect];
        
        return editor;
    }
    
    /**
     * 创建治疗技能模板
     */
    public static createHealTemplate(): SkillEditor {
        const editor = new SkillEditor();
        editor.skillId = 'skill_heal';
        editor.skillName = '治疗术';
        editor.cost = 30;
        editor.cooldown = 2;
        
        const effect = new SkillEffectConfig();
        effect.type = EffectType.HEAL;
        effect.target = TargetType.SINGLE_ALLY;
        effect.value = 150;
        editor.effects = [effect];
        
        return editor;
    }
    
    /**
     * 创建群体攻击模板
     */
    public static createAoETemplate(): SkillEditor {
        const editor = new SkillEditor();
        editor.skillId = 'skill_aoe';
        editor.skillName = '群体攻击';
        editor.cost = 50;
        editor.cooldown = 3;
        
        const effect = new SkillEffectConfig();
        effect.type = EffectType.DAMAGE;
        effect.target = TargetType.ALL_ENEMIES;
        effect.value = 80;
        editor.effects = [effect];
        
        return editor;
    }
    
    /**
     * 创建控制技能模板
     */
    public static createControlTemplate(): SkillEditor {
        const editor = new SkillEditor();
        editor.skillId = 'skill_stun';
        editor.skillName = '眩晕打击';
        editor.cost = 40;
        editor.cooldown = 4;
        
        const damageEffect = new SkillEffectConfig();
        damageEffect.type = EffectType.DAMAGE;
        damageEffect.target = TargetType.SINGLE_ENEMY;
        damageEffect.value = 120;
        
        const stunEffect = new SkillEffectConfig();
        stunEffect.type = EffectType.STUN;
        stunEffect.target = TargetType.SINGLE_ENEMY;
        stunEffect.duration = 1;
        stunEffect.chance = 50;
        
        editor.effects = [damageEffect, stunEffect];
        
        return editor;
    }
}

export default SkillEditor;
