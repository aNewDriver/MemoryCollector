/**
 * 关卡-战斗接入系统
 * 将关卡配置接入实际战斗流程
 */

import { LevelConfig } from './LevelTypes';
import { EnemyData } from '../data/EnemyDatabase';
import { CardData } from '../data/CardData';

export interface BattleSetup {
    levelId: string;
    enemies: EnemyInstance[];
    playerCards: CardData[];
    rewards: BattleRewards;
    specialRules: string[];
    background: string;
}

export interface EnemyInstance {
    instanceId: string;
    enemyId: string;
    position: number; // 0-4 敌人位置
    currentHp: number;
    maxHp: number;
    buffs: Buff[];
    debuffs: Debuff[];
}

export interface BattleRewards {
    exp: number;
    gold: number;
    memoryShards: number;
    cards?: string[];
    relics?: string[];
}

export interface Buff {
    type: string;
    value: number;
    duration: number;
}

export interface Debuff {
    type: string;
    value: number;
    duration: number;
}

/**
 * 关卡战斗管理器
 */
export class LevelBattleManager {
    private currentBattle: BattleSetup | null = null;
    private enemyDatabase: Map<string, EnemyData> = new Map();

    /**
     * 注册敌人数据库
     */
    registerEnemyDatabase(enemies: EnemyData[]): void {
        for (const enemy of enemies) {
            this.enemyDatabase.set(enemy.id, enemy);
        }
    }

    /**
     * 从关卡配置创建战斗
     */
    createBattleFromLevel(levelConfig: LevelConfig, playerCards: CardData[]): BattleSetup {
        const enemies: EnemyInstance[] = [];
        
        // 根据enemyIds创建敌人实例
        for (let i = 0; i < levelConfig.enemyIds.length; i++) {
            const enemyId = levelConfig.enemyIds[i];
            const enemyData = this.enemyDatabase.get(enemyId);
            
            if (enemyData) {
                // 根据关卡等级缩放敌人属性
                const scaledEnemy = this.scaleEnemyToLevel(enemyData, levelConfig.enemyLevel);
                
                enemies.push({
                    instanceId: `enemy_${Date.now()}_${i}`,
                    enemyId: enemyId,
                    position: i,
                    currentHp: scaledEnemy.stats.hp,
                    maxHp: scaledEnemy.stats.hp,
                    buffs: [],
                    debuffs: []
                });
            }
        }

        const battle: BattleSetup = {
            levelId: levelConfig.id,
            enemies,
            playerCards,
            rewards: levelConfig.rewards,
            specialRules: levelConfig.specialRules || [],
            background: levelConfig.background
        };

        this.currentBattle = battle;
        return battle;
    }

    /**
     * 根据关卡等级缩放敌人属性
     */
    private scaleEnemyToLevel(enemy: EnemyData, targetLevel: number): EnemyData {
        const levelDiff = targetLevel - enemy.level;
        const scaleFactor = 1 + (levelDiff * 0.1); // 每级10%增长

        return {
            ...enemy,
            stats: {
                hp: Math.floor(enemy.stats.hp * scaleFactor),
                atk: Math.floor(enemy.stats.atk * scaleFactor),
                def: Math.floor(enemy.stats.def * scaleFactor),
                spd: enemy.stats.spd,
                crt: enemy.stats.crt,
                cdmg: enemy.stats.cdmg
            }
        };
    }

    /**
     * 获取当前战斗
     */
    getCurrentBattle(): BattleSetup | null {
        return this.currentBattle;
    }

    /**
     * 结束战斗并发放奖励
     */
    endBattle(victory: boolean): BattleRewards | null {
        if (!this.currentBattle) return null;
        
        if (victory) {
            return this.currentBattle.rewards;
        }
        
        return null; // 失败无奖励
    }

    /**
     * 应用特殊规则
     */
    applySpecialRules(rules: string[]): void {
        for (const rule of rules) {
            switch (rule) {
                case 'time_loop':
                    // 时间循环规则实现
                    console.log('激活规则：时间循环');
                    break;
                case 'memory_cost':
                    // 记忆代价规则实现
                    console.log('激活规则：记忆代价');
                    break;
                // ... 更多规则
            }
        }
    }
}

// 导出单例
export const levelBattleManager = new LevelBattleManager();
