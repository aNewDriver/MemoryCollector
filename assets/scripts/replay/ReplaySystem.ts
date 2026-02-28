/**
 * 战斗重放系统
 * 记录和回放战斗过程
 */

import { BattleAction } from '../battle/BattleSystem';

export interface BattleRecord {
    id: string;
    timestamp: number;
    
    // 战斗双方
    attacker: {
        playerId: string;
        name: string;
        cards: string[];
        power: number;
    };
    defender: {
        playerId: string;
        name: string;
        cards: string[];
        power: number;
    };
    
    // 战斗结果
    winner: string;
    totalRounds: number;
    
    // 行动序列
    actions: TimedAction[];
    
    // 统计数据
    stats: {
        totalDamage: { [playerId: string]: number };
        maxDamage: { [playerId: string]: number };
        criticalHits: { [playerId: string]: number };
        skillsUsed: { [playerId: string]: number };
    };
}

export interface TimedAction {
    round: number;
    timestamp: number;  // 相对开始的时间
    action: BattleAction;
    result: {
        damage?: number;
        isCritical?: boolean;
        isKillingBlow?: boolean;
        hpBefore: number;
        hpAfter: number;
    };
}

export class ReplaySystem {
    private records: Map<string, BattleRecord> = new Map();
    private playerRecords: Map<string, string[]> = new Map();  // playerId -> recordIds
    
    // 开始记录战斗
    public startRecording(
        recordId: string,
        attacker: BattleRecord['attacker'],
        defender: BattleRecord['defender']
    ): void {
        const record: BattleRecord = {
            id: recordId,
            timestamp: Date.now(),
            attacker,
            defender,
            winner: '',
            totalRounds: 0,
            actions: [],
            stats: {
                totalDamage: {},
                maxDamage: {},
                criticalHits: {},
                skillsUsed: {}
            }
        };
        
        this.records.set(recordId, record);
    }
    
    // 记录行动
    public recordAction(
        recordId: string,
        round: number,
        action: BattleAction,
        result: TimedAction['result'],
        playerId: string
    ): void {
        const record = this.records.get(recordId);
        if (!record) return;
        
        const timedAction: TimedAction = {
            round,
            timestamp: Date.now() - record.timestamp,
            action,
            result
        };
        
        record.actions.push(timedAction);
        
        // 更新统计
        if (result.damage) {
            record.stats.totalDamage[playerId] = (record.stats.totalDamage[playerId] || 0) + result.damage;
            record.stats.maxDamage[playerId] = Math.max(
                record.stats.maxDamage[playerId] || 0,
                result.damage
            );
            
            if (result.isCritical) {
                record.stats.criticalHits[playerId] = (record.stats.criticalHits[playerId] || 0) + 1;
            }
        }
        
        record.stats.skillsUsed[playerId] = (record.stats.skillsUsed[playerId] || 0) + 1;
    }
    
    // 结束记录
    public endRecording(
        recordId: string,
        winner: string,
        totalRounds: number
    ): BattleRecord | null {
        const record = this.records.get(recordId);
        if (!record) return null;
        
        record.winner = winner;
        record.totalRounds = totalRounds;
        
        // 关联到玩家
        [record.attacker.playerId, record.defender.playerId].forEach(pid => {
            if (!this.playerRecords.has(pid)) {
                this.playerRecords.set(pid, []);
            }
            this.playerRecords.get(pid)!.push(recordId);
        });
        
        return record;
    }
    
    // 获取重放数据
    public getReplay(recordId: string): BattleRecord | null {
        return this.records.get(recordId) || null;
    }
    
    // 获取玩家战斗记录
    public getPlayerRecords(playerId: string): BattleRecord[] {
        const recordIds = this.playerRecords.get(playerId) || [];
        return recordIds
            .map(id => this.records.get(id))
            .filter((r): r is BattleRecord => r !== undefined)
            .sort((a, b) => b.timestamp - a.timestamp);
    }
    
    // 分享战斗记录
    public shareRecord(recordId: string): {
        shareId: string;
        url: string;
    } | null {
        const record = this.records.get(recordId);
        if (!record) return null;
        
        const shareId = `SHARE_${recordId}`;
        return {
            shareId,
            url: `https://game.example.com/replay/${shareId}`
        };
    }
    
    // 导出记录（用于分享）
    public exportRecord(recordId: string): string | null {
        const record = this.records.get(recordId);
        if (!record) return null;
        
        return JSON.stringify(record);
    }
    
    // 导入记录
    public importRecord(data: string): BattleRecord | null {
        try {
            const record: BattleRecord = JSON.parse(data);
            this.records.set(record.id, record);
            return record;
        } catch (e) {
            console.error('Failed to import record:', e);
            return null;
        }
    }
    
    // 删除记录
    public deleteRecord(recordId: string): boolean {
        const record = this.records.get(recordId);
        if (!record) return false;
        
        this.records.delete(recordId);
        
        // 从玩家记录中移除
        [record.attacker.playerId, record.defender.playerId].forEach(pid => {
            const records = this.playerRecords.get(pid);
            if (records) {
                const index = records.indexOf(recordId);
                if (index > -1) records.splice(index, 1);
            }
        });
        
        return true;
    }
    
    // 获取精彩时刻（高伤害、反杀等）
    public getHighlights(recordId: string): {
        type: string;
        round: number;
        description: string;
    }[] {
        const record = this.records.get(recordId);
        if (!record) return [];
        
        const highlights: { type: string; round: number; description: string }[] = [];
        
        record.actions.forEach(action => {
            // 暴击时刻
            if (action.result.isCritical && action.result.damage > 5000) {
                highlights.push({
                    type: 'critical',
                    round: action.round,
                    description: `第${action.round}回合：暴击${action.result.damage}伤害！`
                });
            }
            
            // 击杀时刻
            if (action.result.isKillingBlow) {
                highlights.push({
                    type: 'kill',
                    round: action.round,
                    description: `第${action.round}回合：一击必杀！`
                });
            }
        });
        
        return highlights;
    }
}

// 单例
export const replaySystem = new ReplaySystem();
