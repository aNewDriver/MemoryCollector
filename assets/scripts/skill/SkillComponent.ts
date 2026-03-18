/**
 * SkillComponent
 * Cocos Creator 技能操作组件
 * 提供可视化技能释放、技能按钮、技能动画触发
 */

import { _decorator, Component, Node, Button, Label, Sprite, Color, tween, Vec3, Animation, AnimationClip, SpriteFrame, resources } from 'cc';
import { SkillData, EffectType } from '../data/CardData';
import { BattleUnit } from '../battle/BattleSystem';
import { SkillSystem, SkillResult } from './SkillSystem';
import { effectManager, FloatTextType } from '../effects/EffectManager';
import { audioManager, SFXType } from '../audio/AudioManager';

const { ccclass, property } = _decorator;

/**
 * 技能按钮配置
 */
interface SkillButtonConfig {
    button: Button;
    icon: Sprite;
    cooldownMask: Sprite;
    costLabel: Label;
    cooldownLabel: Label;
}

/**
 * 技能操作组件
 * 挂载在战斗场景的SkillManager节点上
 */
@ccclass('SkillComponent')
export class SkillComponent extends Component {
    
    // ========== 编辑器可配置属性 ==========
    
    @property(Node)
    skillPanel: Node | null = null;  // 技能面板根节点
    
    @property([Node])
    skillButtons: Node[] = [];  // 技能按钮节点数组
    
    @property(Node)
    targetSelector: Node | null = null;  // 目标选择器
    
    @property
    showDebugLog: boolean = false;  // 是否显示调试日志
    
    // ========== 内部状态 ==========
    
    private currentUnit: BattleUnit | null = null;
    private currentSkills: SkillData[] = [];
    private selectedSkill: SkillData | null = null;
    private skillButtonConfigs: SkillButtonConfig[] = [];
    private onSkillComplete: ((result: SkillResult) => void) | null = null;
    private onTargetSelected: ((targetIds: string[]) => void) | null = null;
    
    // ========== 生命周期 ==========
    
    onLoad() {
        this.initializeSkillButtons();
        this.hideSkillPanel();
    }
    
    /**
     * 初始化技能按钮
     */
    private initializeSkillButtons(): void {
        this.skillButtonConfigs = [];
        
        for (const buttonNode of this.skillButtons) {
            const config: SkillButtonConfig = {
                button: buttonNode.getComponent(Button)!,
                icon: buttonNode.getChildByName('Icon')?.getComponent(Sprite)!,
                cooldownMask: buttonNode.getChildByName('CooldownMask')?.getComponent(Sprite)!,
                costLabel: buttonNode.getChildByName('CostLabel')?.getComponent(Label)!,
                cooldownLabel: buttonNode.getChildByName('CooldownLabel')?.getComponent(Label)!
            };
            
            // 绑定点击事件
            config.button.node.on(Button.EventType.CLICK, () => {
                const index = this.skillButtonConfigs.indexOf(config);
                if (index >= 0) {
                    this.onSkillButtonClicked(index);
                }
            });
            
            this.skillButtonConfigs.push(config);
        }
    }
    
    // ========== 公共接口 ==========
    
    /**
     * 设置当前战斗单位并显示技能面板
     * @param unit 当前行动的单位
     * @param skills 单位的技能列表
     * @param onComplete 技能执行完成回调
     */
    public showSkillsForUnit(
        unit: BattleUnit,
        skills: SkillData[],
        onComplete: (result: SkillResult) => void
    ): void {
        this.currentUnit = unit;
        this.currentSkills = skills;
        this.onSkillComplete = onComplete;
        
        this.updateSkillPanel();
        this.showSkillPanel();
        
        // 播放技能面板显示动画
        this.playPanelShowAnimation();
    }
    
    /**
     * 隐藏技能面板
     */
    public hideSkillPanel(): void {
        if (this.skillPanel) {
            this.skillPanel.active = false;
        }
    }
    
    /**
     * 更新技能面板状态
     * 在回合开始或冷却变化时调用
     */
    public updateSkillPanel(): void {
        if (!this.currentUnit || !this.skillPanel) return;
        
        for (let i = 0; i < this.skillButtonConfigs.length; i++) {
            const config = this.skillButtonConfigs[i];
            const skill = this.currentSkills[i];
            
            if (!skill) {
                config.button.node.active = false;
                continue;
            }
            
            config.button.node.active = true;
            
            // 更新图标
            this.loadSkillIcon(skill.icon, config.icon);
            
            // 检查技能是否可用
            const isAvailable = SkillSystem.isSkillAvailable(this.currentUnit, skill);
            config.button.interactable = isAvailable;
            
            // 更新能量消耗显示
            if (config.costLabel) {
                config.costLabel.string = skill.cost.toString();
                config.costLabel.color = this.currentUnit.currentEnergy >= skill.cost 
                    ? Color.WHITE : Color.RED;
            }
            
            // 更新冷却显示
            const cooldown = this.currentUnit.skillCooldowns.get(skill.id) || 0;
            if (config.cooldownLabel) {
                config.cooldownLabel.string = cooldown > 0 ? cooldown.toString() : '';
            }
            if (config.cooldownMask) {
                config.cooldownMask.fillRange = cooldown / skill.cooldown;
            }
        }
    }
    
    /**
     * 执行技能
     * 战斗系统调用此方法来执行技能
     */
    public executeSkill(
        caster: BattleUnit,
        skill: SkillData,
        targets: BattleUnit[],
        allUnits: BattleUnit[]
    ): SkillResult {
        // 播放技能释放动画
        this.playSkillCastAnimation(caster, skill);
        
        // 执行技能效果
        const result = SkillSystem.executeSkill(caster, skill, targets, allUnits);
        
        // 播放技能效果动画
        this.playSkillEffectAnimation(result, targets);
        
        // 消耗能量
        caster.currentEnergy -= skill.cost;
        
        // 回调
        if (this.onSkillComplete) {
            this.onSkillComplete(result);
        }
        
        return result;
    }
    
    /**
     * 显示目标选择器
     */
    public showTargetSelector(
        validTargets: BattleUnit[],
        onSelected: (targetIds: string[]) => void
    ): void {
        this.onTargetSelected = onSelected;
        
        if (this.targetSelector) {
            this.targetSelector.active = true;
            
            // TODO: 创建目标选择按钮
            // 为每个有效目标创建可点击区域
        }
    }
    
    /**
     * 隐藏目标选择器
     */
    public hideTargetSelector(): void {
        if (this.targetSelector) {
            this.targetSelector.active = false;
        }
    }
    
    // ========== 动画效果 ==========
    
    /**
     * 播放技能面板显示动画
     */
    private playPanelShowAnimation(): void {
        if (!this.skillPanel) return;
        
        this.skillPanel.active = true;
        this.skillPanel.setScale(0.8, 0.8);
        this.skillPanel.opacity = 0;
        
        tween(this.skillPanel)
            .to(0.2, { scale: new Vec3(1, 1, 1) })
            .start();
        
        tween(this.skillPanel)
            .to(0.2, { opacity: 255 })
            .start();
    }
    
    /**
     * 播放技能释放动画
     */
    private playSkillCastAnimation(caster: BattleUnit, skill: SkillData): void {
        // 播放音效
        audioManager.playSFX(SFXType.SKILL_CAST);
        
        // TODO: 获取施法者节点并播放动画
        // const casterNode = this.getUnitNode(caster.instanceId);
        // if (casterNode) {
        //     const anim = casterNode.getComponent(Animation);
        //     if (anim) {
        //         anim.play('skill_cast');
        //     }
        // }
    }
    
    /**
     * 播放技能效果动画
     */
    private playSkillEffectAnimation(result: SkillResult, targets: BattleUnit[]): void {
        for (const targetResult of result.targets) {
            const target = targets.find(t => t.instanceId === targetResult.targetId);
            if (!target) continue;
            
            // 播放伤害/治疗飘字
            if (targetResult.damage && targetResult.damage > 0) {
                this.showDamageFloat(target, targetResult.damage, targetResult.isCrit);
            }
            if (targetResult.heal && targetResult.heal > 0) {
                this.showHealFloat(target, targetResult.heal);
            }
            
            // 播放buff/debuff特效
            if (targetResult.buffsApplied && targetResult.buffsApplied.length > 0) {
                this.playBuffEffect(target);
            }
            if (targetResult.debuffsApplied && targetResult.debuffsApplied.length > 0) {
                this.playDebuffEffect(target);
            }
        }
    }
    
    /**
     * 显示伤害飘字
     */
    private showDamageFloat(target: BattleUnit, damage: number, isCrit: boolean = false): void {
        // TODO: 获取目标节点位置
        // const targetNode = this.getUnitNode(target.instanceId);
        // if (targetNode) {
        //     const pos = targetNode.worldPosition;
        //     effectManager.showDamageNumber(
        //         this.node,
        //         pos,
        //         damage,
        //         isCrit ? FloatTextType.CRIT : FloatTextType.DAMAGE,
        //         isCrit
        //     );
        // }
    }
    
    /**
     * 显示治疗飘字
     */
    private showHealFloat(target: BattleUnit, heal: number): void {
        // TODO: 获取目标节点位置
        // const targetNode = this.getUnitNode(target.instanceId);
        // if (targetNode) {
        //     const pos = targetNode.worldPosition;
        //     effectManager.showDamageNumber(
        //         this.node,
        //         pos,
        //         heal,
        //         FloatTextType.HEAL
        //     );
        // }
    }
    
    /**
     * 播放增益特效
     */
    private playBuffEffect(target: BattleUnit): void {
        // TODO: 播放buff特效
        // effectManager.playEffect(EffectType.SKILL_BUFF, targetNode);
    }
    
    /**
     * 播放减益特效
     */
    private playDebuffEffect(target: BattleUnit): void {
        // TODO: 播放debuff特效
        // effectManager.playEffect(EffectType.SKILL_DEBUFF, targetNode);
    }
    
    // ========== 私有方法 ==========
    
    /**
     * 技能按钮点击处理
     */
    private onSkillButtonClicked(index: number): void {
        const skill = this.currentSkills[index];
        if (!skill || !this.currentUnit) return;
        
        // 检查技能是否可用
        if (!SkillSystem.isSkillAvailable(this.currentUnit, skill)) {
            this.showDebugInfo('技能不可用（冷却中或能量不足）');
            return;
        }
        
        this.selectedSkill = skill;
        
        // 根据技能目标类型处理
        if (skill.effects.length === 0) {
            this.showDebugInfo('技能没有配置效果');
            return;
        }
        
        const targetType = skill.effects[0].target;
        
        // 自动选择目标（无需手动选择）
        if (targetType === 'self' || targetType === 'all_enemies' || targetType === 'all_allies') {
            this.executeSelectedSkill([]);
        } else {
            // 需要手动选择目标
            // TODO: 显示目标选择器
            this.showDebugInfo(`请选择目标 - ${skill.name}`);
        }
    }
    
    /**
     * 执行选中的技能
     */
    private executeSelectedSkill(targetIds: string[]): void {
        if (!this.selectedSkill || !this.currentUnit) return;
        
        // 通知战斗系统执行技能
        // 实际逻辑由BattleSystem处理
        this.hideSkillPanel();
    }
    
    /**
     * 加载技能图标
     */
    private loadSkillIcon(iconPath: string, sprite: Sprite): void {
        if (!sprite) return;
        
        resources.load(iconPath, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.warn(`Failed to load skill icon: ${iconPath}`);
                return;
            }
            sprite.spriteFrame = spriteFrame;
        });
    }
    
    /**
     * 显示调试信息
     */
    private showDebugInfo(message: string): void {
        if (this.showDebugLog) {
            console.log(`[SkillComponent] ${message}`);
        }
    }
    
    /**
     * 获取单位节点（需要在战斗场景中实现）
     */
    private getUnitNode(instanceId: string): Node | null {
        // TODO: 从BattleScene获取单位节点
        return null;
    }
}

export default SkillComponent;
