/**
 * 视觉特效管理器
 * 战斗特效、UI特效、场景特效
 */

import { _decorator, Component, Node, ParticleSystem2D, Animation, tween, Vec3, Color, Label, UIOpacity } from 'cc';
import { CardRarity } from '../data/CardData';

const { ccclass } = _decorator;

// 特效类型枚举
export enum EffectType {
    // 伤害特效
    DAMAGE_NORMAL = 'damage_normal',
    DAMAGE_CRIT = 'damage_crit',
    DAMAGE_HEAL = 'damage_heal',
    DAMAGE_MISS = 'damage_miss',
    
    // 技能特效
    SKILL_CAST = 'skill_cast',
    SKILL_HIT = 'skill_hit',
    SKILL_BUFF = 'skill_buff',
    SKILL_DEBUFF = 'skill_debuff',
    
    // 状态特效
    BUFF_START = 'buff_start',
    BUFF_END = 'buff_end',
    STUN = 'stun',
    TAUNT = 'taunt',
    
    // UI特效
    UI_POPUP = 'ui_popup',
    UI_FLOAT_TEXT = 'ui_float_text',
    UI_SHAKE = 'ui_shake',
    UI_FLASH = 'ui_flash',
    
    // 场景特效
    BATTLE_START = 'battle_start',
    BATTLE_WIN = 'battle_win',
    BATTLE_LOSE = 'battle_lose',
    LEVEL_UP = 'level_up',
    RARITY_GLOW = 'rarity_glow'
}

// 飘字类型
export enum FloatTextType {
    DAMAGE = 'damage',
    CRIT = 'crit',
    HEAL = 'heal',
    MISS = 'miss',
    BUFF = 'buff',
    GOLD = 'gold',
    EXP = 'exp'
}

@ccclass('EffectManager')
export class EffectManager extends Component {
    private static _instance: EffectManager | null = null;
    
    public static getInstance(): EffectManager {
        return this._instance!;
    }
    
    onLoad() {
        EffectManager._instance = this;
    }
    
    onDestroy() {
        if (EffectManager._instance === this) {
            EffectManager._instance = null;
        }
    }
    
    // ==================== 伤害数字飘字 ====================
    
    /**
     * 显示伤害数字
     * @param parent 父节点
     * @param position 世界坐标
     * @param value 数值
     * @param type 飘字类型
     * @param isCrit 是否暴击
     */
    public showDamageNumber(
        parent: Node,
        position: Vec3,
        value: number,
        type: FloatTextType = FloatTextType.DAMAGE,
        isCrit: boolean = false
    ): void {
        // 创建飘字节点
        const floatNode = new Node('FloatText');
        parent.addChild(floatNode);
        floatNode.setWorldPosition(position);
        
        // 添加Label组件
        const label = floatNode.addComponent(Label);
        
        // 根据类型设置样式
        switch (type) {
            case FloatTextType.DAMAGE:
                label.string = `-${value}`;
                label.color = Color.WHITE;
                label.fontSize = isCrit ? 48 : 32;
                break;
            case FloatTextType.CRIT:
                label.string = `-${value}!`;
                label.color = new Color(255, 107, 107);
                label.fontSize = 48;
                break;
            case FloatTextType.HEAL:
                label.string = `+${value}`;
                label.color = new Color(78, 205, 196);
                label.fontSize = 32;
                break;
            case FloatTextType.MISS:
                label.string = 'MISS';
                label.color = Color.GRAY;
                label.fontSize = 24;
                break;
            case FloatTextType.GOLD:
                label.string = `+${value}💰`;
                label.color = new Color(255, 215, 0);
                label.fontSize = 28;
                break;
            case FloatTextType.EXP:
                label.string = `+${value} EXP`;
                label.color = new Color(168, 85, 247);
                label.fontSize = 28;
                break;
        }
        
        // 执行飘字动画
        const startPos = floatNode.position.clone();
        const endPos = new Vec3(startPos.x, startPos.y + 100, startPos.z);
        
        // 上浮+放大+淡出
        tween(floatNode)
            .parallel(
                tween().to(0.5, { position: endPos }, { easing: 'quadOut' }),
                tween().to(0.3, { scale: new Vec3(isCrit ? 1.5 : 1.2, isCrit ? 1.5 : 1.2, 1) }),
                tween().to(0.5, { opacity: 0 })
            )
            .call(() => {
                floatNode.destroy();
            })
            .start();
    }
    
    // ==================== 屏幕特效 ====================
    
    /**
     * 屏幕震动
     * @param intensity 震动强度
     * @param duration 持续时间
     */
    public screenShake(intensity: number = 10, duration: number = 0.3): void {
        const camera = this.node.scene?.getComponentInChildren('Camera') as any;
        if (!camera) return;
        
        const originalPos = camera.node.position.clone();
        
        // 震动序列
        const shakeTween = tween(camera.node);
        const steps = 10;
        const stepDuration = duration / steps;
        
        for (let i = 0; i < steps; i++) {
            const offsetX = (Math.random() - 0.5) * intensity;
            const offsetY = (Math.random() - 0.5) * intensity;
            shakeTween.to(stepDuration, { 
                position: new Vec3(originalPos.x + offsetX, originalPos.y + offsetY, originalPos.z) 
            });
        }
        
        shakeTween.call(() => {
            camera.node.setPosition(originalPos);
        }).start();
    }
    
    /**
     * 屏幕闪光
     * @param color 闪光颜色
     * @param duration 持续时间
     */
    public screenFlash(color: Color = Color.WHITE, duration: number = 0.2): void {
        // 创建闪光层
        const flashNode = new Node('ScreenFlash');
        this.node.addChild(flashNode);
        flashNode.setSiblingIndex(999); // 确保在最上层
        
        const uiOpacity = flashNode.addComponent(UIOpacity);
        uiOpacity.opacity = 255;
        
        // 渐隐
        tween(uiOpacity)
            .to(duration, { opacity: 0 })
            .call(() => {
                flashNode.destroy();
            })
            .start();
    }
    
    // ==================== 单位特效 ====================
    
    /**
     * 播放受击特效
     * @param target 目标节点
     * @param isCrit 是否暴击
     */
    public playHitEffect(target: Node, isCrit: boolean = false): void {
        // 红色闪烁
        const sprite = target.getComponent('Sprite') as any;
        if (sprite) {
            const originalColor = sprite.color.clone();
            sprite.color = isCrit ? new Color(255, 0, 0) : new Color(255, 100, 100);
            
            tween(sprite)
                .to(0.1, { color: originalColor })
                .start();
        }
        
        // 震动效果
        const originalPos = target.position.clone();
        tween(target)
            .to(0.05, { position: new Vec3(originalPos.x - 5, originalPos.y, originalPos.z) })
            .to(0.05, { position: new Vec3(originalPos.x + 5, originalPos.y, originalPos.z) })
            .to(0.05, { position: originalPos })
            .start();
        
        // 暴击时屏幕震动
        if (isCrit) {
            this.screenShake(15, 0.3);
        }
    }
    
    /**
     * 播放治疗特效
     * @param target 目标节点
     */
    public playHealEffect(target: Node): void {
        // 绿色闪烁
        const sprite = target.getComponent('Sprite') as any;
        if (sprite) {
            const originalColor = sprite.color.clone();
            sprite.color = new Color(100, 255, 100);
            
            tween(sprite)
                .to(0.3, { color: originalColor })
                .start();
        }
        
        // 放大缩小（脉动效果）
        const originalScale = target.scale.clone();
        tween(target)
            .to(0.15, { scale: new Vec3(originalScale.x * 1.1, originalScale.y * 1.1, 1) })
            .to(0.15, { scale: originalScale })
            .start();
    }
    
    /**
     * 播放技能释放特效
     * @param caster 施法者节点
     * @param targets 目标节点数组
     * @param skillElement 技能元素类型
     */
    public playSkillCastEffect(
        caster: Node,
        targets: Node[],
        skillElement: string
    ): void {
        // 施法者发光
        const sprite = caster.getComponent('Sprite') as any;
        if (sprite) {
            const glowColor = this.getElementColor(skillElement);
            const originalColor = sprite.color.clone();
            sprite.color = glowColor;
            
            tween(sprite)
                .to(0.3, { color: originalColor })
                .start();
        }
        
        // 创建技能弹道（如果有目标）
        if (targets.length > 0) {
            targets.forEach(target => {
                this.createProjectile(caster, target, skillElement);
            });
        }
    }
    
    /**
     * 创建弹道特效
     */
    private createProjectile(from: Node, to: Node, element: string): void {
        const projectile = new Node('Projectile');
        this.node.addChild(projectile);
        projectile.setWorldPosition(from.worldPosition);
        
        // 根据元素设置颜色
        const color = this.getElementColor(element);
        
        // 飞向目标
        tween(projectile)
            .to(0.3, { worldPosition: to.worldPosition })
            .call(() => {
                // 到达时创建爆炸特效
                this.createExplosion(to.worldPosition, color);
                projectile.destroy();
            })
            .start();
    }
    
    /**
     * 创建爆炸特效
     */
    private createExplosion(position: Vec3, color: Color): void {
        // 屏幕闪光
        this.screenFlash(color, 0.1);
        
        // TODO: 添加粒子系统
    }
    
    // ==================== 稀有度光效 ====================
    
    /**
     * 播放稀有度光效
     * @param node 卡牌节点
     * @param rarity 稀有度
     */
    public playRarityGlow(node: Node, rarity: CardRarity): void {
        if (rarity < CardRarity.SR) return; // 只有SR以上有光效
        
        const glowColor = rarity === CardRarity.UR ? new Color(255, 0, 0) :
                         rarity === CardRarity.SSR ? new Color(255, 215, 0) :
                         new Color(168, 85, 247);
        
        // 发光动画（缩放+颜色闪烁）
        const originalScale = node.scale.clone();
        
        tween(node)
            .to(0.3, { 
                scale: new Vec3(originalScale.x * 1.1, originalScale.y * 1.1, 1)
            })
            .to(0.3, { scale: originalScale })
            .union()
            .repeatForever()
            .start();
    }
    
    // ==================== 场景特效 ====================
    
    /**
     * 播放战斗开始特效
     */
    public playBattleStartEffect(): void {
        this.screenFlash(Color.WHITE, 0.3);
        
        // 文字动画："战斗开始"
        const textNode = new Node('BattleStartText');
        this.node.addChild(textNode);
        
        const label = textNode.addComponent(Label);
        label.string = '战斗开始!';
        label.fontSize = 64;
        label.color = new Color(255, 215, 0);
        
        // 从大到小+淡出
        textNode.setScale(new Vec3(2, 2, 1));
        tween(textNode)
            .to(0.5, { scale: new Vec3(1, 1, 1) })
            .to(0.3, { opacity: 0 })
            .call(() => textNode.destroy())
            .start();
    }
    
    /**
     * 播放战斗结果特效
     * @param win 是否胜利
     */
    public playBattleResultEffect(win: boolean): void {
        // 屏幕着色
        const overlayColor = win ? new Color(255, 215, 0, 100) : new Color(100, 100, 100, 150);
        this.screenFlash(win ? new Color(255, 215, 0) : Color.GRAY, 0.5);
        
        // 结果文字
        const textNode = new Node('ResultText');
        this.node.addChild(textNode);
        
        const label = textNode.addComponent(Label);
        label.string = win ? '胜利!' : '失败...';
        label.fontSize = 72;
        label.color = win ? new Color(255, 215, 0) : Color.GRAY;
        
        // 缩放+弹跳动画
        textNode.setScale(new Vec3(0, 0, 1));
        tween(textNode)
            .to(0.5, { scale: new Vec3(1.2, 1.2, 1) }, { easing: 'backOut' })
            .to(0.2, { scale: new Vec3(1, 1, 1) })
            .delay(1)
            .to(0.3, { opacity: 0 })
            .call(() => textNode.destroy())
            .start();
    }
    
    /**
     * 播放升级特效
     */
    public playLevelUpEffect(target: Node): void {
        // 金色光芒
        this.screenFlash(new Color(255, 215, 0), 0.3);
        
        // 目标放大发光
        const originalScale = target.scale.clone();
        tween(target)
            .to(0.3, { scale: new Vec3(originalScale.x * 1.3, originalScale.y * 1.3, 1) })
            .to(0.3, { scale: originalScale })
            .start();
        
        // 飘字
        this.showDamageNumber(
            this.node,
            target.worldPosition,
            0,
            FloatTextType.EXP
        );
    }
    
    // ==================== 辅助方法 ====================
    
    private getElementColor(element: string): Color {
        switch (element) {
            case 'gold': return new Color(255, 215, 0);
            case 'wood': return new Color(107, 142, 35);
            case 'water': return new Color(30, 144, 255);
            case 'fire': return new Color(255, 69, 0);
            case 'earth': return new Color(139, 69, 19);
            case 'light': return new Color(255, 255, 200);
            case 'dark': return new Color(75, 0, 130);
            default: return Color.WHITE;
        }
    }
}

// 导出单例
export const effectManager = EffectManager.getInstance();
