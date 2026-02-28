/**
 * 战斗系统核心
 * 回合制战斗逻辑
 */

import { CardInstance, Stats, EffectType, TargetType, checkElementAdvantage, getTeamElementBonus, ElementType } from '../data/CardData';

// 战斗单位（运行时的卡牌实例）
export interface BattleUnit {
    instanceId: string;
    cardId: string;
    team: TeamType;
    position: number;  // 0-4 站位
    element: ElementType;  // 元素属性
    rarity: number;        // 稀有度
    
    // 当前状态
    currentHp: number;
    maxHp: number;
    currentEnergy: number;
    maxEnergy: number;
    
    // 属性（计算buff/debuff后）
    stats: Stats;
    
    // buff/debuff
    buffs: Buff[];
    debuffs: Debuff[];
    
    // 状态
    isDead: boolean;
    isStunned: boolean;
    isTaunted: boolean;
    
    // 冷却
    skillCooldowns: Map<string, number>;
    
    // 本场战斗数据
    damageDealt: number;
    damageTaken: number;
    healingDone: number;
}

export enum TeamType {
    PLAYER = 'player',
    ENEMY = 'enemy'
}

export interface Buff {
    id: string;
    type: EffectType;
    value: number;
    duration: number;
    source: string;  // 来源单位instanceId
}

export interface Debuff {
    id: string;
    type: EffectType;
    value: number;
    duration: number;
    source: string;
}

// 战斗事件
export enum BattleEventType {
    BATTLE_START = 'battle_start',
    TURN_START = 'turn_start',
    ACTION_START = 'action_start',
    SKILL_CAST = 'skill_cast',
    DAMAGE = 'damage',
    HEAL = 'heal',
    BUFF_APPLY = 'buff_apply',
    DEBUFF_APPLY = 'debuff_apply',
    UNIT_DIE = 'unit_die',
    BATTLE_END = 'battle_end'
}

export interface BattleEvent {
    type: BattleEventType;
    data: any;
}

// 战斗状态
export enum BattleState {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    PLAYER_WIN = 'player_win',
    ENEMY_WIN = 'enemy_win',
    DRAW = 'draw'
}

export class BattleSystem {
    private units: BattleUnit[] = [];
    private turnCount: number = 0;
    private currentUnitIndex: number = 0;
    private state: BattleState = BattleState.PENDING;
    private eventListeners: Map<BattleEventType, Function[]> = new Map();
    
    // 初始化战斗
    public initBattle(playerTeam: CardInstance[], enemyTeam: CardInstance[]): void {
        this.units = [];
        this.turnCount = 0;
        this.state = BattleState.IN_PROGRESS;
        
        // 创建玩家单位
        playerTeam.forEach((card, index) => {
            this.units.push(this.createBattleUnit(card, TeamType.PLAYER, index));
        });
        
        // 创建敌方单位
        enemyTeam.forEach((card, index) => {
            this.units.push(this.createBattleUnit(card, TeamType.ENEMY, index));
        });
        
        // 按速度排序决定行动顺序
        this.sortUnitsBySpeed();
        
        this.emit(BattleEventType.BATTLE_START, { units: this.units });
        this.startTurn();
    }
    
    private createBattleUnit(card: CardInstance, team: TeamType, position: number): BattleUnit {
        const stats = card.currentStats;
        const { getCardData } = require('../data/CardDatabase');
        const cardData = getCardData(card.cardId);
        
        return {
            instanceId: card.instanceId,
            cardId: card.cardId,
            team,
            position,
            element: cardData?.element || 'earth',
            rarity: cardData?.rarity || 1,
            currentHp: stats.hp,
            maxHp: stats.hp,
            currentEnergy: 0,
            maxEnergy: 100,
            stats: { ...stats },
            buffs: [],
            debuffs: [],
            isDead: false,
            isStunned: false,
            isTaunted: false,
            skillCooldowns: new Map(),
            damageDealt: 0,
            damageTaken: 0,
            healingDone: 0
        };
    }
    
    private sortUnitsBySpeed(): void {
        this.units.sort((a, b) => b.stats.spd - a.stats.spd);
    }
    
    // 开始回合
    private startTurn(): void {
        if (this.state !== BattleState.IN_PROGRESS) return;
        
        this.turnCount++;
        
        // 处理当前单位
        const unit = this.units[this.currentUnitIndex];
        
        // 跳过死亡单位
        if (unit.isDead) {
            this.nextTurn();
            return;
        }
        
        // 回合开始处理
        this.processTurnStart(unit);
        
        this.emit(BattleEventType.TURN_START, { 
            turn: this.turnCount, 
            unit: unit.instanceId 
        });
    }
    
    private processTurnStart(unit: BattleUnit): void {
        // 恢复能量
        unit.currentEnergy = Math.min(unit.currentEnergy + 20, unit.maxEnergy);
        
        // 减少buff/debuff持续时间
        unit.buffs = unit.buffs.filter(buff => {
            buff.duration--;
            return buff.duration > 0;
        });
        unit.debuffs = unit.debuffs.filter(debuff => {
            debuff.duration--;
            return debuff.duration > 0;
        });
        
        // 减少技能冷却
        unit.skillCooldowns.forEach((cd, skillId) => {
            if (cd > 0) {
                unit.skillCooldowns.set(skillId, cd - 1);
            }
        });
        
        // 处理持续伤害（燃烧、中毒）
        this.processDotDamage(unit);
        
        // 检查眩晕
        unit.isStunned = unit.debuffs.some(d => d.type === EffectType.STUN);
    }
    
    private processDotDamage(unit: BattleUnit): void {
        const burn = unit.debuffs.find(d => d.type === EffectType.BURN);
        const poison = unit.debuffs.find(d => d.type === EffectType.POISON);
        
        if (burn) {
            const damage = burn.value;
            this.applyDamage(unit, damage, 'burn');
        }
        if (poison) {
            const damage = poison.value;
            this.applyDamage(unit, damage, 'poison');
        }
    }
    
    // 执行行动
    public executeAction(unitId: string, skillId: string, targetIds: string[]): void {
        const unit = this.units.find(u => u.instanceId === unitId);
        if (!unit || unit.isDead || unit.isStunned) return;
        
        this.emit(BattleEventType.ACTION_START, { unit: unitId, skill: skillId });
        
        // 获取技能数据并执行
        // TODO: 从CardDatabase获取技能详情并处理效果
        
        this.emit(BattleEventType.SKILL_CAST, {
            caster: unitId,
            skill: skillId,
            targets: targetIds
        });
        
        // 检查战斗是否结束
        this.checkBattleEnd();
        
        // 下一回合
        if (this.state === BattleState.IN_PROGRESS) {
            this.nextTurn();
        }
    }
    
    // 自动行动（AI）
    public executeAutoAction(unitId: string): void {
        const unit = this.units.find(u => u.instanceId === unitId);
        if (!unit) return;
        
        // AI逻辑：优先使用绝技，随机选择目标
        // TODO: 实现更智能的AI
    }
    
    private nextTurn(): void {
        this.currentUnitIndex = (this.currentUnitIndex + 1) % this.units.length;
        this.startTurn();
    }
    
    // 伤害计算
    private calculateDamage(
        attacker: BattleUnit, 
        defender: BattleUnit, 
        skillMultiplier: number
    ): number {
        // 基础伤害 = 攻击 * 技能倍率
        let damage = attacker.stats.atk * (skillMultiplier / 100);
        
        // 防御减免
        const defenseReduction = defender.stats.def / (defender.stats.def + 200);
        damage *= (1 - defenseReduction);
        
        // 暴击
        const isCrit = Math.random() * 100 < attacker.stats.crt;
        if (isCrit) {
            damage *= (attacker.stats.cdmg / 100);
        }
        
        // 元素克制加成
        const elementAdvantage = checkElementAdvantage(attacker.element, defender.element);
        if (elementAdvantage === 1) {
            damage *= 1.3;  // 克制 +30% 伤害
        } else if (elementAdvantage === -1) {
            damage *= 0.7;  // 被克制 -30% 伤害
        }
        
        // buff/debuff影响
        const atkBuff = attacker.buffs.find(b => b.type === EffectType.BUFF_ATK);
        if (atkBuff) damage *= (1 + atkBuff.value / 100);
        
        const defDebuff = defender.debuffs.find(d => d.type === EffectType.DEBUFF_DEF);
        if (defDebuff) damage *= (1 + defDebuff.value / 100);
        
        // 随机浮动 ±5%
        damage *= (0.95 + Math.random() * 0.1);
        
        return Math.floor(damage);
    }
    
    private applyDamage(unit: BattleUnit, damage: number, source: string): void {
        // 护盾优先吸收
        const shield = unit.buffs.find(b => b.type === EffectType.SHIELD);
        if (shield) {
            if (shield.value >= damage) {
                shield.value -= damage;
                damage = 0;
            } else {
                damage -= shield.value;
                shield.value = 0;
            }
        }
        
        unit.currentHp -= damage;
        unit.damageTaken += damage;
        
        this.emit(BattleEventType.DAMAGE, {
            target: unit.instanceId,
            damage: damage,
            source: source,
            currentHp: unit.currentHp
        });
        
        if (unit.currentHp <= 0) {
            unit.currentHp = 0;
            unit.isDead = true;
            this.emit(BattleEventType.UNIT_DIE, { unit: unit.instanceId });
        }
    }
    
    // 治疗
    private applyHeal(unit: BattleUnit, amount: number, source: string): void {
        unit.currentHp = Math.min(unit.currentHp + amount, unit.maxHp);
        unit.healingDone += amount;
        
        this.emit(BattleEventType.HEAL, {
            target: unit.instanceId,
            heal: amount,
            source: source,
            currentHp: unit.currentHp
        });
    }
    
    // 检查战斗结束
    private checkBattleEnd(): void {
        const playerAlive = this.units.some(u => u.team === TeamType.PLAYER && !u.isDead);
        const enemyAlive = this.units.some(u => u.team === TeamType.ENEMY && !u.isDead);
        
        if (!playerAlive && !enemyAlive) {
            this.state = BattleState.DRAW;
        } else if (!playerAlive) {
            this.state = BattleState.ENEMY_WIN;
        } else if (!enemyAlive) {
            this.state = BattleState.PLAYER_WIN;
        }
        
        if (this.state !== BattleState.IN_PROGRESS) {
            this.emit(BattleEventType.BATTLE_END, { result: this.state });
        }
    }
    
    // 事件监听
    public on(event: BattleEventType, callback: Function): void {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event)!.push(callback);
    }
    
    private emit(event: BattleEventType, data: any): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.forEach(cb => cb(data));
        }
    }
    
    // 获取战斗状态
    public getBattleState(): BattleState {
        return this.state;
    }
    
    public getCurrentUnit(): BattleUnit | null {
        return this.units[this.currentUnitIndex] || null;
    }
    
    public getAllUnits(): BattleUnit[] {
        return this.units;
    }
    
    public getTurnCount(): number {
        return this.turnCount;
    }
}
