/**
 * 战斗场景 - 完整版
 * 包含战斗单位可视化、技能特效、镜头动画等
 */

import { 
    _decorator, Node, Label, Sprite, ProgressBar, Color, Vec3, 
    tween, UIOpacity, Animation, ParticleSystem2D, Camera, 
    UITransform, Vec2, instantiate, Prefab, director, easing 
} from 'cc';
import { EnhancedScene } from '../base/EnhancedScene';
import { BattleSystem, BattleUnit, BattleState, BattleEventType, SkillType } from '../../battle/BattleSystem';
import { CardInstance, CardData } from '../../data/CardData';
import { LevelData } from '../../data/PlayerData';
import { sceneManager } from '../../core/SceneManager';

const { ccclass, property } = _decorator;

// 战斗单位UI数据
interface UnitUI {
    instanceId: string;
    node: Node;
    cardData: CardData;
    
    // UI组件
    hpBar: ProgressBar;
    hpLabel: Label;
    energyBar: ProgressBar;
    avatarSprite: Sprite;
    elementIcon: Sprite;
    rarityFrame: Sprite;
    
    // 状态
    isDead: boolean;
    buffNodes: Node[];
}

// 伤害数字
interface DamageNumber {
    value: number;
    isCrit: boolean;
    isHeal: boolean;
    position: Vec3;
}

@ccclass('BattleSceneEnhanced')
export class BattleSceneEnhanced extends EnhancedScene {
    
    // ============ 战斗系统 ============
    private battleSystem: BattleSystem = new BattleSystem();
    
    // ============ 区域节点 ============
    @property(Node)
    private enemyArea: Node | null = null;
    
    @property(Node)
    private playerArea: Node | null = null;
    
    @property(Node)
    private battleField: Node | null = null;
    
    // ============ UI节点 ============
    @property(Node)
    private turnIndicator: Node | null = null;
    
    @property(Label)
    private turnLabel: Label | null = null;
    
    @property(Label)
    private roundLabel: Label | null = null;
    
    @property(Node)
    private skillPanel: Node | null = null;
    
    @property([Node])
    private skillButtons: Node[] = [];
    
    @property(Label)
    private battleSpeedLabel: Label | null = null;
    
    // ============ 结果界面 ============
    @property(Node)
    private resultPanel: Node | null = null;
    
    @property(Node)
    private victoryPanel: Node | null = null;
    
    @property(Node)
    private defeatPanel: Node | null = null;
    
    // ============ 特效节点 ============
    @property(Node)
    private effectLayer: Node | null = null;
    
    @property(Node)
    private cameraNode: Node | null = null;
    
    // ============ 单位预制体 ============
    @property(Prefab)
    private unitPrefab: Prefab | null = null;
    
    @property(Prefab)
    private damageNumberPrefab: Prefab | null = null;
    
    // ============ 数据 ============
    private unitUIs: Map<string, UnitUI> = new Map();
    private currentLevel: LevelData | null = null;
    private battleSpeed: number = 1;
    private isAutoBattle: boolean = false;
    
    // 位置配置（竖屏5v5布局）
    private readonly PLAYER_POSITIONS: Vec3[] = [
        new Vec3(-120, -350, 0),  // 前排左
        new Vec3(0, -380, 0),     // 前排中
        new Vec3(120, -350, 0),   // 前排右
        new Vec3(-150, -500, 0),  // 后排左
        new Vec3(150, -500, 0),   // 后排右
    ];
    
    private readonly ENEMY_POSITIONS: Vec3[] = [
        new Vec3(-120, 100, 0),   // 前排左
        new Vec3(0, 70, 0),       // 前排中
        new Vec3(120, 100, 0),    // 前排右
        new Vec3(-150, 250, 0),   // 后排左
        new Vec3(150, 250, 0),    // 后排右
    ];
    
    onLoad() {
        super.onLoad();
        this.registerBattleEvents();
    }
    
    /**
     * 开始关卡战斗
     */
    public startLevel(level: LevelData, playerTeam: CardInstance[]) {
        this.currentLevel = level;
        
        // 应用场景配置
        const sceneConfig = this.getBattleSceneConfig(level);
        this.applySceneConfig(sceneConfig);
        
        // 创建敌方队伍
        const enemyTeam = this.createEnemyTeam(level.enemies || []);
        
        // 初始化战斗
        this.battleSystem.initBattle(playerTeam, enemyTeam);
        
        // 创建战斗单位UI
        this.createUnitNodes();
        
        // 开场动画
        this.playStartAnimation();
        
        // 更新UI
        this.updateUI();
    }
    
    /**
     * 获取战斗场景配置
     */
    private getBattleSceneConfig(level: LevelData) {
        // 根据关卡类型返回不同配置
        const chapter = Math.floor((level.levelNumber - 1) / 50) + 1;
        
        const configs: { [key: string]: any } = {
            1: { bg: 'scenes/battle/library_battle.png', lighting: 'normal', effect: 'floating_paper' },
            2: { bg: 'scenes/battle/fog_battle.png', lighting: 'dark', effect: 'fog' },
            3: { bg: 'scenes/battle/underwater_battle.png', lighting: 'mysterious', effect: 'bubble' },
            4: { bg: 'scenes/battle/volcano_battle.png', lighting: 'dark', effect: 'embers' },
        };
        
        const config = configs[chapter] || configs[1];
        
        return {
            id: `battle_ch${chapter}`,
            name: '战斗场景',
            backgroundImage: config.bg,
            bgm: level.isBoss ? 'bgm_boss_battle' : 'bgm_normal_battle',
            lighting: config.lighting,
            ambientEffect: config.effect
        };
    }
    
    /**
     * 创建敌方队伍
     */
    private createEnemyTeam(enemyConfigs: any[]): CardInstance[] {
        return enemyConfigs.map((config, index) => {
            return {
                instanceId: `enemy_${index}`,
                cardId: config.enemyId || `enemy_${config.type}_${index}`,
                level: config.level || 1,
                exp: 0,
                ascension: 0,
                skillLevels: { normal: 1, special: 1, passive: 1 },
                affinity: 0,
                affinityLevel: 1,
                awakened: false,
                equipments: [],
                currentStats: {
                    hp: config.hp || 2000 + (config.level || 1) * 100,
                    atk: config.atk || 100 + (config.level || 1) * 10,
                    def: config.def || 50 + (config.level || 1) * 5,
                    spd: config.spd || 100,
                    crt: config.crt || 10,
                    cdmg: config.cdmg || 150,
                    acc: config.acc || 0,
                    res: config.res || 10
                }
            } as CardInstance;
        });
    }
    
    /**
     * 创建战斗单位节点
     */
    private createUnitNodes() {
        this.unitUIs.clear();
        
        const units = this.battleSystem.getAllUnits();
        
        units.forEach((unit, index) => {
            const unitUI = this.createUnitUI(unit);
            this.unitUIs.set(unit.instanceId, unitUI);
            
            // 添加到对应区域
            const parent = unit.team === 'player' ? this.playerArea : this.enemyArea;
            if (parent) {
                parent.addChild(unitUI.node);
            }
            
            // 设置位置
            const positions = unit.team === 'player' ? this.PLAYER_POSITIONS : this.ENEMY_POSITIONS;
            const pos = positions[unit.position] || positions[0];
            unitUI.node.setPosition(pos);
            
            // 入场动画
            this.playEntryAnimation(unitUI.node, unit.team);
        });
    }
    
    /**
     * 创建单位UI
     */
    private createUnitUI(unit: BattleUnit): UnitUI {
        const node = instantiate(this.unitPrefab) || new Node(`Unit_${unit.instanceId}`);
        
        // 创建基础结构
        if (!this.unitPrefab) {
            this.buildUnitNodeStructure(node, unit);
        }
        
        // 获取或创建组件
        const hpBar = this.findOrCreateProgressBar(node, 'HPBar');
        const hpLabel = this.findOrCreateLabel(node, 'HPLabel');
        const energyBar = this.findOrCreateProgressBar(node, 'EnergyBar');
        const avatarSprite = this.findOrCreateSprite(node, 'Avatar');
        const elementIcon = this.findOrCreateSprite(node, 'Element');
        const rarityFrame = this.findOrCreateSprite(node, 'RarityFrame');
        
        // 初始化数值
        this.updateUnitHP(unit, hpBar, hpLabel);
        this.updateUnitEnergy(unit, energyBar);
        
        return {
            instanceId: unit.instanceId,
            node,
            cardData: unit.cardData,
            hpBar,
            hpLabel,
            energyBar,
            avatarSprite,
            elementIcon,
            rarityFrame,
            isDead: false,
            buffNodes: []
        };
    }
    
    /**
     * 构建单位节点结构（当没有预制体时使用）
     */
    private buildUnitNodeStructure(node: Node, unit: BattleUnit) {
        // 头像
        const avatarNode = new Node('Avatar');
        avatarNode.addComponent(Sprite);
        node.addChild(avatarNode);
        
        // 血条背景
        const hpBg = new Node('HPBarBg');
        hpBg.addComponent(Sprite).color = new Color(50, 50, 50);
        node.addChild(hpBg);
        
        // 血条
        const hpBar = new Node('HPBar');
        hpBar.addComponent(Sprite).color = unit.team === 'player' ? new Color(50, 200, 50) : new Color(200, 50, 50);
        hpBg.addChild(hpBar);
        
        // 血条文字
        const hpLabel = new Node('HPLabel');
        const label = hpLabel.addComponent(Label);
        label.fontSize = 18;
        label.color = new Color(255, 255, 255);
        node.addChild(hpLabel);
        
        // 能量条
        const energyBar = new Node('EnergyBar');
        energyBar.addComponent(Sprite).color = new Color(50, 150, 255);
        node.addChild(energyBar);
        
        // 元素图标
        const elementNode = new Node('Element');
        elementNode.addComponent(Sprite);
        node.addChild(elementNode);
        
        // 稀有度框
        const rarityNode = new Node('RarityFrame');
        rarityNode.addComponent(Sprite);
        node.addChild(rarityNode);
    }
    
    /**
     * 查找或创建组件的辅助方法
     */
    private findOrCreateProgressBar(parent: Node, name: string): ProgressBar {
        const child = parent.getChildByName(name);
        if (child) {
            return child.getComponent(ProgressBar) || child.addComponent(ProgressBar);
        }
        const node = new Node(name);
        parent.addChild(node);
        return node.addComponent(ProgressBar);
    }
    
    private findOrCreateLabel(parent: Node, name: string): Label {
        const child = parent.getChildByName(name);
        if (child) {
            return child.getComponent(Label) || child.addComponent(Label);
        }
        const node = new Node(name);
        parent.addChild(node);
        return node.addComponent(Label);
    }
    
    private findOrCreateSprite(parent: Node, name: string): Sprite {
        const child = parent.getChildByName(name);
        if (child) {
            return child.getComponent(Sprite) || child.addComponent(Sprite);
        }
        const node = new Node(name);
        parent.addChild(node);
        return node.addComponent(Sprite);
    }
    
    /**
     * 更新单位血量显示
     */
    private updateUnitHP(unit: BattleUnit, hpBar?: ProgressBar, hpLabel?: Label) {
        const ui = this.unitUIs.get(unit.instanceId);
        if (!ui) return;
        
        const bar = hpBar || ui.hpBar;
        const label = hpLabel || ui.hpLabel;
        
        const ratio = unit.currentHP / unit.maxHP;
        bar.progress = ratio;
        
        if (label) {
            label.string = `${Math.floor(unit.currentHP)}/${unit.maxHP}`;
        }
        
        // 低血量变红
        if (ratio < 0.3) {
            bar.node.getComponent(Sprite)!.color = new Color(255, 50, 50);
        }
    }
    
    /**
     * 更新单位能量显示
     */
    private updateUnitEnergy(unit: BattleUnit, energyBar?: ProgressBar) {
        const ui = this.unitUIs.get(unit.instanceId);
        if (!ui) return;
        
        const bar = energyBar || ui.energyBar;
        bar.progress = unit.currentEnergy / unit.maxEnergy;
    }
    
    // ============ 动画效果 ============
    
    /**
     * 播放开场动画
     */
    private playStartAnimation() {
        // 镜头从远到近
        if (this.cameraNode) {
            this.cameraNode.setScale(1.5, 1.5, 1);
            tween(this.cameraNode)
                .to(1, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
                .start();
        }
        
        // 单位依次入场
        let delay = 0;
        this.unitUIs.forEach((ui) => {
            ui.node.setScale(0, 0, 1);
            tween(ui.node)
                .delay(delay)
                .to(0.3, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
                .start();
            delay += 0.1;
        });
    }
    
    /**
     * 入场动画
     */
    private playEntryAnimation(node: Node, team: string) {
        const startX = team === 'player' ? -400 : 400;
        const targetX = node.position.x;
        
        node.setPosition(startX, node.position.y, 0);
        tween(node)
            .to(0.5, { position: new Vec3(targetX, node.position.y, 0) }, { easing: 'quadOut' })
            .start();
    }
    
    /**
     * 攻击动画
     */
    private playAttackAnimation(attackerId: string, targetId: string, skillType: SkillType) {
        const attacker = this.unitUIs.get(attackerId);
        const target = this.unitUIs.get(targetId);
        
        if (!attacker || !target) return;
        
        const attackerPos = attacker.node.position;
        const targetPos = target.node.position;
        
        // 计算攻击方向
        const direction = new Vec3(targetPos.x - attackerPos.x, targetPos.y - attackerPos.y, 0).normalize();
        const attackDistance = 50;
        
        // 根据技能类型选择动画
        switch (skillType) {
            case SkillType.NORMAL:
                this.playNormalAttackAnimation(attacker, target, direction, attackDistance);
                break;
            case SkillType.SPECIAL:
                this.playSpecialAttackAnimation(attacker, target, direction);
                break;
            case SkillType.PASSIVE:
                this.playPassiveSkillAnimation(attacker);
                break;
        }
    }
    
    /**
     * 普通攻击动画
     */
    private playNormalAttackAnimation(attacker: UnitUI, target: UnitUI, direction: Vec3, distance: number) {
        // 蓄力
        tween(attacker.node)
            .to(0.2, { scale: new Vec3(0.9, 0.9, 1) })
            .to(0.1, { scale: new Vec3(1.1, 1.1, 1) })
            // 突进
            .by(0.15, { 
                position: new Vec3(direction.x * distance, direction.y * distance, 0) 
            }, { easing: 'quadOut' })
            .call(() => {
                // 命中震动
                this.shakeNode(target.node, 5);
            })
            // 返回
            .by(0.2, { 
                position: new Vec3(-direction.x * distance, -direction.y * distance, 0) 
            }, { easing: 'quadOut' })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .start();
    }
    
    /**
     * 特殊技能动画
     */
    private playSpecialAttackAnimation(attacker: UnitUI, target: UnitUI, direction: Vec3) {
        // 技能蓄力特效
        this.spawnChargeEffect(attacker.node.position);
        
        // 蓄力缩放+发光
        tween(attacker.node)
            .to(0.5, { scale: new Vec3(1.2, 1.2, 1) })
            .call(() => {
                // 释放技能
                this.spawnSkillEffect(attacker.cardData.element, attacker.node.position, target.node.position);
            })
            .to(0.3, { scale: new Vec3(1, 1, 1) })
            .start();
        
        // 目标被击中
        this.scheduleOnce(() => {
            this.shakeNode(target.node, 10);
            this.spawnHitEffect(target.node.position);
        }, 0.6);
    }
    
    /**
     * 被动技能动画
     */
    private playPassiveSkillAnimation(unit: UnitUI) {
        // 光环效果
        tween(unit.node)
            .to(0.3, { scale: new Vec3(1.1, 1.1, 1) })
            .to(0.3, { scale: new Vec3(1, 1, 1) })
            .start();
        
        // Buff特效
        this.spawnBuffEffect(unit.node.position, 'buff');
    }
    
    /**
     * 受击动画
     */
    private playHurtAnimation(unitId: string) {
        const ui = this.unitUIs.get(unitId);
        if (!ui || ui.isDead) return;
        
        // 闪红
        const sprite = ui.node.getComponent(Sprite);
        if (sprite) {
            const originalColor = sprite.color.clone();
            sprite.color = new Color(255, 100, 100);
            
            tween(sprite)
                .delay(0.2)
                .call(() => {
                    sprite.color = originalColor;
                })
                .start();
        }
        
        // 震动
        this.shakeNode(ui.node, 8);
    }
    
    /**
     * 死亡动画
     */
    private playDeathAnimation(unitId: string) {
        const ui = this.unitUIs.get(unitId);
        if (!ui) return;
        
        ui.isDead = true;
        
        // 变灰+下沉
        const sprite = ui.node.getComponent(Sprite);
        if (sprite) {
            sprite.color = new Color(100, 100, 100);
        }
        
        tween(ui.node)
            .to(0.5, { position: new Vec3(ui.node.position.x, ui.node.position.y - 30, 0) })
            .to(0.3, { opacity: 0 })
            .call(() => {
                ui.node.active = false;
            })
            .start();
    }
    
    /**
     * 节点震动
     */
    private shakeNode(node: Node, intensity: number) {
        const originalPos = node.position.clone();
        
        tween(node)
            .by(0.05, { position: new Vec3(intensity, 0, 0) })
            .by(0.05, { position: new Vec3(-intensity * 2, 0, 0) })
            .by(0.05, { position: new Vec3(intensity, 0, 0) })
            .call(() => {
                node.setPosition(originalPos);
            })
            .start();
    }
    
    // ============ 特效系统 ============
    
    /**
     * 创建蓄力特效
     */
    private spawnChargeEffect(position: Vec3) {
        if (!this.effectLayer) return;
        
        const effect = new Node('ChargeEffect');
        effect.setPosition(position);
        
        const sprite = effect.addComponent(Sprite);
        sprite.color = new Color(255, 255, 150, 200);
        
        this.effectLayer.addChild(effect);
        
        // 扩散动画
        effect.setScale(0.5, 0.5, 1);
        tween(effect)
            .to(0.5, { scale: new Vec3(1.5, 1.5, 1) })
            .to(0.2, { opacity: 0 })
            .call(() => effect.destroy())
            .start();
    }
    
    /**
     * 创建技能特效
     */
    private spawnSkillEffect(element: string, startPos: Vec3, endPos: Vec3) {
        if (!this.effectLayer) return;
        
        const effect = new Node('SkillEffect');
        effect.setPosition(startPos);
        
        const sprite = effect.addComponent(Sprite);
        sprite.color = this.getElementColor(element);
        
        this.effectLayer.addChild(effect);
        
        // 飞行动画
        tween(effect)
            .to(0.3, { position: endPos }, { easing: 'quadOut' })
            .call(() => {
                this.spawnExplosionEffect(endPos, element);
                effect.destroy();
            })
            .start();
    }
    
    /**
     * 创建命中特效
     */
    private spawnHitEffect(position: Vec3) {
        if (!this.effectLayer) return;
        
        const effect = new Node('HitEffect');
        effect.setPosition(position);
        
        const sprite = effect.addComponent(Sprite);
        sprite.color = new Color(255, 200, 100);
        
        this.effectLayer.addChild(effect);
        
        tween(effect)
            .to(0.1, { scale: new Vec3(1.5, 1.5, 1) })
            .to(0.2, { scale: new Vec3(0, 0, 1), opacity: 0 })
            .call(() => effect.destroy())
            .start();
    }
    
    /**
     * 创建爆炸特效
     */
    private spawnExplosionEffect(position: Vec3, element: string) {
        if (!this.effectLayer) return;
        
        // 创建多个粒子
        for (let i = 0; i < 8; i++) {
            const particle = new Node(`Explosion_${i}`);
            particle.setPosition(position);
            
            const sprite = particle.addComponent(Sprite);
            sprite.color = this.getElementColor(element);
            
            this.effectLayer.addChild(particle);
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            const targetX = position.x + Math.cos(angle) * distance;
            const targetY = position.y + Math.sin(angle) * distance;
            
            tween(particle)
                .to(0.3, { position: new Vec3(targetX, targetY, 0) })
                .to(0.2, { opacity: 0 })
                .call(() => particle.destroy())
                .start();
        }
    }
    
    /**
     * 创建Buff特效
     */
    private spawnBuffEffect(position: Vec3, buffType: string) {
        if (!this.effectLayer) return;
        
        const effect = new Node('BuffEffect');
        effect.setPosition(position.x, position.y + 50, 0);
        
        const sprite = effect.addComponent(Sprite);
        sprite.color = buffType === 'buff' ? new Color(100, 255, 100) : new Color(255, 100, 100);
        
        this.effectLayer.addChild(effect);
        
        tween(effect)
            .by(1, { position: new Vec3(0, 30, 0) })
            .to(0.5, { opacity: 0 })
            .call(() => effect.destroy())
            .start();
    }
    
    /**
     * 显示伤害数字
     */
    private showDamageNumber(damage: number, position: Vec3, isCrit: boolean = false, isHeal: boolean = false) {
        const node = instantiate(this.damageNumberPrefab) || new Node('DamageNumber');
        
        if (!this.damageNumberPrefab) {
            const label = node.addComponent(Label);
            label.fontSize = isCrit ? 48 : 36;
            label.color = isHeal ? new Color(100, 255, 100) : (isCrit ? new Color(255, 50, 50) : new Color(255, 255, 255));
            label.string = Math.floor(damage).toString();
        }
        
        node.setPosition(position.x, position.y + 50, 0);
        
        if (this.effectLayer) {
            this.effectLayer.addChild(node);
        }
        
        // 弹出动画
        const jumpHeight = isCrit ? 80 : 50;
        tween(node)
            .by(0.3, { position: new Vec3(0, jumpHeight, 0) }, { easing: 'quadOut' })
            .by(0.2, { position: new Vec3(0, -20, 0) })
            .delay(0.5)
            .to(0.3, { opacity: 0 })
            .call(() => node.destroy())
            .start();
    }
    
    /**
     * 获取元素颜色
     */
    private getElementColor(element: string): Color {
        const colors: { [key: string]: Color } = {
            'gold': new Color(255, 215, 0),
            'wood': new Color(50, 200, 50),
            'water': new Color(50, 150, 255),
            'fire': new Color(255, 80, 50),
            'earth': new Color(200, 150, 80),
            'light': new Color(255, 255, 200),
            'dark': new Color(150, 50, 200),
        };
        return colors[element] || new Color(255, 255, 255);
    }
    
    // ============ 战斗事件处理 ============
    
    private registerBattleEvents() {
        // 回合开始
        this.battleSystem.on(BattleEventType.TURN_START, (data: { turn: number; unit: string }) => {
            this.onTurnStart(data);
        });
        
        // 技能释放
        this.battleSystem.on(BattleEventType.SKILL_CAST, (data: any) => {
            this.onSkillCast(data);
        });
        
        // 伤害
        this.battleSystem.on(BattleEventType.DAMAGE, (data: any) => {
            this.onDamage(data);
        });
        
        // 治疗
        this.battleSystem.on(BattleEventType.HEAL, (data: any) => {
            this.onHeal(data);
        });
        
        // 单位死亡
        this.battleSystem.on(BattleEventType.UNIT_DIE, (data: { unit: string }) => {
            this.onUnitDie(data.unit);
        });
        
        // 战斗结束
        this.battleSystem.on(BattleEventType.BATTLE_END, (data: { result: BattleState }) => {
            this.onBattleEnd(data.result);
        });
    }
    
    private onTurnStart(data: { turn: number; unit: string }) {
        this.updateUI();
        
        const currentUnit = this.battleSystem.getCurrentUnit();
        if (!currentUnit) return;
        
        // 高亮当前单位
        this.highlightCurrentUnit(currentUnit.instanceId);
        
        if (currentUnit.team === 'player') {
            this.showSkillPanel(currentUnit);
        } else {
            this.scheduleOnce(() => {
                this.battleSystem.executeAutoAction(currentUnit.instanceId);
            }, 1 / this.battleSpeed);
        }
    }
    
    private highlightCurrentUnit(unitId: string) {
        // 重置所有单位
        this.unitUIs.forEach((ui) => {
            ui.node.setScale(1, 1, 1);
        });
        
        // 高亮当前单位
        const ui = this.unitUIs.get(unitId);
        if (ui && !ui.isDead) {
            tween(ui.node)
                .to(0.2, { scale: new Vec3(1.1, 1.1, 1) })
                .start();
        }
    }
    
    private onSkillCast(data: { caster: string; target: string; skillType: SkillType }) {
        this.playAttackAnimation(data.caster, data.target, data.skillType);
    }
    
    private onDamage(data: { target: string; damage: number; isCrit: boolean }) {
        const ui = this.unitUIs.get(data.target);
        if (ui) {
            this.playHurtAnimation(data.target);
            this.showDamageNumber(data.damage, ui.node.position, data.isCrit);
        }
    }
    
    private onHeal(data: { target: string; amount: number }) {
        const ui = this.unitUIs.get(data.target);
        if (ui) {
            this.showDamageNumber(data.amount, ui.node.position, false, true);
            this.spawnBuffEffect(ui.node.position, 'heal');
        }
    }
    
    private onUnitDie(unitId: string) {
        this.playDeathAnimation(unitId);
    }
    
    private onBattleEnd(result: BattleState) {
        this.scheduleOnce(() => {
            this.showResult(result);
        }, 1);
    }
    
    // ============ UI更新 ============
    
    private updateUI() {
        const state = this.battleSystem.getBattleState();
        
        if (this.roundLabel) {
            this.roundLabel.string = `回合 ${state.round}`;
        }
        if (this.turnLabel) {
            this.turnLabel.string = `行动 ${state.turn}/${state.totalUnits}`;
        }
        
        // 更新所有单位血条
        state.units.forEach(unit => {
            this.updateUnitHP(unit);
            this.updateUnitEnergy(unit);
        });
    }
    
    private showSkillPanel(unit: BattleUnit) {
        if (this.skillPanel) {
            this.skillPanel.active = true;
        }
        
        // 更新技能按钮状态
        this.skillButtons.forEach((btn, index) => {
            const skill = unit.cardData.skills[index];
            if (skill) {
                const canUse = unit.currentEnergy >= (skill.energyCost || 0);
                btn.active = true;
                btn.opacity = canUse ? 255 : 128;
            } else {
                btn.active = false;
            }
        });
    }
    
    private showResult(result: BattleState) {
        if (result === BattleState.VICTORY && this.victoryPanel) {
            this.victoryPanel.active = true;
            this.playVictoryAnimation();
        } else if (result === BattleState.DEFEAT && this.defeatPanel) {
            this.defeatPanel.active = true;
        }
        
        if (this.resultPanel) {
            this.resultPanel.active = true;
        }
    }
    
    private playVictoryAnimation() {
        // 胜利特效
        this.unitUIs.forEach((ui) => {
            if (!ui.isDead && ui.node) {
                tween(ui.node)
                    .by(0.2, { position: new Vec3(0, 20, 0) })
                    .by(0.2, { position: new Vec3(0, -20, 0) })
                    .delay(0.2)
                    .union()
                    .repeat(3)
                    .start();
            }
        });
    }
    
    // ============ 玩家操作 ============
    
    public onSkillClick(skillIndex: number) {
        const currentUnit = this.battleSystem.getCurrentUnit();
        if (!currentUnit) return;
        
        const skill = currentUnit.cardData.skills[skillIndex];
        if (!skill) return;
        
        // 检查能量
        if (currentUnit.currentEnergy < (skill.energyCost || 0)) {
            // 能量不足提示
            return;
        }
        
        // 隐藏技能面板
        if (this.skillPanel) {
            this.skillPanel.active = false;
        }
        
        // 执行技能
        this.battleSystem.executeSkill(currentUnit.instanceId, skillIndex);
    }
    
    public onAutoBattleToggle() {
        this.isAutoBattle = !this.isAutoBattle;
        // 更新按钮状态
    }
    
    public onSpeedChange() {
        this.battleSpeed = this.battleSpeed === 1 ? 2 : this.battleSpeed === 2 ? 3 : 1;
        if (this.battleSpeedLabel) {
            this.battleSpeedLabel.string = `${this.battleSpeed}x`;
        }
    }
    
    public onPauseClick() {
        // 暂停战斗
    }
    
    public onContinueClick() {
        // 继续下一关或返回
        sceneManager.goBack();
    }
    
    public onRetryClick() {
        // 重试
        if (this.currentLevel) {
            // 重新加载当前关卡
        }
    }
}
