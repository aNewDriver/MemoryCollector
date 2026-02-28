/**
 * AI战斗机器人
 * 自动测试、机器人对战、新手教学
 */

import { BattleCard } from '../battle/BattleCard';
import { BattleAction, Skill } from '../battle/BattleSystem';
import { Element } from '../data/CardData';

export enum AIDifficulty {
    EASY = 'easy',       // 简单 - 随机行动
    NORMAL = 'normal',   // 普通 - 基础策略
    HARD = 'hard',       // 困难 - 最优技能选择
    EXPERT = 'expert'    // 专家 - 完整战术
}

export interface AIBot {
    id: string;
    name: string;
    difficulty: AIDifficulty;
    personality: 'aggressive' | 'defensive' | 'balanced';
}

export class AIBattleBot {
    private bot: AIBot;
    private myCards: BattleCard[];
    private enemyCards: BattleCard[];
    
    constructor(bot: AIBot) {
        this.bot = bot;
        this.myCards = [];
        this.enemyCards = [];
    }
    
    // 设置战斗信息
    public setBattleInfo(myCards: BattleCard[], enemyCards: BattleCard[]): void {
        this.myCards = myCards;
        this.enemyCards = enemyCards;
    }
    
    // 获取AI行动
    public getAction(): BattleAction {
        switch (this.bot.difficulty) {
            case AIDifficulty.EASY:
                return this.getEasyAction();
            case AIDifficulty.NORMAL:
                return this.getNormalAction();
            case AIDifficulty.HARD:
                return this.getHardAction();
            case AIDifficulty.EXPERT:
                return this.getExpertAction();
            default:
                return this.getNormalAction();
        }
    }
    
    // 简单AI - 完全随机
    private getEasyAction(): BattleAction {
        const aliveCards = this.myCards.filter(c => c.currentHp > 0);
        const actor = aliveCards[Math.floor(Math.random() * aliveCards.length)];
        
        const aliveEnemies = this.enemyCards.filter(c => c.currentHp > 0);
        const target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
        
        return {
            type: 'skill',
            actorId: actor.id,
            targetId: target?.id,
            skillId: actor.skills[0].id  // 普通攻击
        };
    }
    
    // 普通AI - 基础策略
    private getNormalAction(): BattleAction {
        const aliveCards = this.myCards.filter(c => c.currentHp > 0);
        const actor = this.selectActorByPersonality(aliveCards);
        
        const aliveEnemies = this.enemyCards.filter(c => c.currentHp > 0);
        const target = this.selectTargetNormal(aliveEnemies);
        
        const skill = this.selectSkillNormal(actor, target);
        
        return {
            type: 'skill',
            actorId: actor.id,
            targetId: target?.id,
            skillId: skill.id
        };
    }
    
    // 困难AI - 最优选择
    private getHardAction(): BattleAction {
        const aliveCards = this.myCards.filter(c => c.currentHp > 0);
        let bestAction: BattleAction | null = null;
        let bestScore = -Infinity;
        
        for (const actor of aliveCards) {
            for (const skill of actor.skills) {
                if (skill.currentCooldown > 0) continue;
                
                const targets = this.getValidTargets(skill, actor);
                for (const target of targets) {
                    const score = this.evaluateAction(actor, skill, target);
                    if (score > bestScore) {
                        bestScore = score;
                        bestAction = {
                            type: 'skill',
                            actorId: actor.id,
                            targetId: target?.id,
                            skillId: skill.id
                        };
                    }
                }
            }
        }
        
        return bestAction || this.getNormalAction();
    }
    
    // 专家AI - 完整战术
    private getExpertAction(): BattleAction {
        // 考虑阵容配合、技能连招、血量管理
        return this.getHardAction();  // 先复用困难逻辑，后续扩展
    }
    
    // 根据性格选择行动角色
    private selectActorByPersonality(aliveCards: BattleCard[]): BattleCard {
        switch (this.bot.personality) {
            case 'aggressive':
                // 选择攻击力最高的
                return aliveCards.reduce((best, card) => 
                    card.attack > best.attack ? card : best
                );
            case 'defensive':
                // 选择血量最高的
                return aliveCards.reduce((best, card) => 
                    card.currentHp > best.currentHp ? card : best
                );
            case 'balanced':
            default:
                return aliveCards[0];
        }
    }
    
    // 普通难度目标选择
    private selectTargetNormal(aliveEnemies: BattleCard[]): BattleCard | null {
        if (aliveEnemies.length === 0) return null;
        
        // 优先打血量最低的
        return aliveEnemies.reduce((weakest, card) => 
            card.currentHp < weakest.currentHp ? card : weakest
        );
    }
    
    // 普通难度技能选择
    private selectSkillNormal(actor: BattleCard, target: BattleCard | null): Skill {
        // 优先使用绝技（如果有且冷却好）
        const specialSkill = actor.skills.find(s => 
            s.id.includes('special') && s.currentCooldown === 0
        );
        if (specialSkill) return specialSkill;
        
        // 否则使用普攻
        return actor.skills[0];
    }
    
    // 获取有效目标
    private getValidTargets(skill: Skill, actor: BattleCard): (BattleCard | null)[] {
        if (skill.target === 'self') return [actor];
        if (skill.target === 'all_enemy') return [null];  // AOE不需要指定单个目标
        
        const aliveEnemies = this.enemyCards.filter(c => c.currentHp > 0);
        return aliveEnemies.length > 0 ? aliveEnemies : [null];
    }
    
    // 评估行动价值
    private evaluateAction(
        actor: BattleCard,
        skill: Skill,
        target: BattleCard | null
    ): number {
        let score = 0;
        
        // 基础伤害评估
        if (target) {
            const estimatedDamage = this.estimateDamage(actor, skill, target);
            score += estimatedDamage;
            
            // 击杀奖励
            if (target.currentHp <= estimatedDamage) {
                score += 1000;
            }
        }
        
        // 考虑克制关系
        if (target && this.isElementAdvantage(actor.element, target.element)) {
            score *= 1.3;
        }
        
        // 绝技优先级
        if (skill.id.includes('special')) {
            score *= 1.2;
        }
        
        return score;
    }
    
    // 估算伤害
    private estimateDamage(actor: BattleCard, skill: Skill, target: BattleCard): number {
        let baseDamage = actor.attack * skill.damagePercent;
        
        // 考虑防御
        baseDamage *= (100 / (100 + target.defense));
        
        // 暴击概率
        if (Math.random() < actor.critRate) {
            baseDamage *= actor.critDamage;
        }
        
        return Math.floor(baseDamage);
    }
    
    // 检查元素克制
    private isElementAdvantage(attacker: Element, defender: Element): boolean {
        const advantage: Record<Element, Element> = {
            [Element.METAL]: Element.WOOD,
            [Element.WOOD]: Element.EARTH,
            [Element.EARTH]: Element.WATER,
            [Element.WATER]: Element.FIRE,
            [Element.FIRE]: Element.METAL,
            [Element.LIGHT]: Element.METAL,
            [Element.DARK]: Element.WOOD
        };
        
        return advantage[attacker] === defender;
    }
}

// AI机器人工厂
export class AIBotFactory {
    private static bots: Map<string, AIBot> = new Map();
    
    static createBot(id: string, difficulty: AIDifficulty, personality: AIBot['personality'] = 'balanced'): AIBattleBot {
        const bot: AIBot = {
            id,
            name: `AI_${difficulty}_${id}`,
            difficulty,
            personality
        };
        this.bots.set(id, bot);
        return new AIBattleBot(bot);
    }
    
    static getBot(id: string): AIBot | null {
        return this.bots.get(id) || null;
    }
}

// 单例导出
export const aiBotFactory = AIBotFactory;
