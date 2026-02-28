/**
 * 反作弊检测系统
 * 检测异常数据、外挂行为
 */

export enum CheatType {
    SPEED_HACK = 'speed_hack',       // 加速外挂
    DAMAGE_HACK = 'damage_hack',     // 伤害修改
    RESOURCE_HACK = 'resource_hack', // 资源修改
    AUTO_PLAY = 'auto_play',         // 自动脚本
    MULTI_ACCOUNT = 'multi_account', // 多开/小号
    DATA_TAMPERING = 'data_tampering', // 数据篡改
    TIME_MANIPULATION = 'time_manipulation' // 时间篡改
}

export interface CheatDetection {
    type: CheatType;
    playerId: string;
    confidence: number;      // 置信度 0-1
    evidence: any;           // 证据数据
    detectedAt: number;
    action: 'warn' | 'suspend' | 'ban' | 'monitor';
}

export class AntiCheatSystem {
    private detections: Map<string, CheatDetection[]> = new Map();
    private playerBehaviors: Map<string, {
        actions: number;
        lastActionTime: number;
        suspiciousScore: number;
    }> = new Map();
    
    private thresholds = {
        maxActionsPerSecond: 10,      // 每秒最大操作数
        maxDamageMultiplier: 3,        // 最大伤害倍数
        minClearTime: 5000,            // 最小通关时间（毫秒）
        maxResourceChange: 1000000,    // 最大单次资源变化
        maxLoginIps: 3                 // 最大不同IP数
    };
    
    // 记录玩家行为
    public recordAction(playerId: string, actionType: string, data: any): void {
        const now = Date.now();
        
        if (!this.playerBehaviors.has(playerId)) {
            this.playerBehaviors.set(playerId, {
                actions: 0,
                lastActionTime: now,
                suspiciousScore: 0
            });
        }
        
        const behavior = this.playerBehaviors.get(playerId)!;
        behavior.actions++;
        
        // 检测操作频率异常
        const timeDiff = now - behavior.lastActionTime;
        if (timeDiff < 1000) {  // 1秒内
            const actionsPerSecond = behavior.actions / (timeDiff / 1000);
            if (actionsPerSecond > this.thresholds.maxActionsPerSecond) {
                this.flagSuspicious(playerId, CheatType.AUTO_PLAY, {
                    actionType,
                    actionsPerSecond,
                    threshold: this.thresholds.maxActionsPerSecond
                });
            }
        } else {
            // 重置计数
            behavior.actions = 1;
            behavior.lastActionTime = now;
        }
        
        // 检测数据异常
        this.validateData(playerId, actionType, data);
    }
    
    // 验证数据合理性
    private validateData(playerId: string, actionType: string, data: any): void {
        switch (actionType) {
            case 'battle_damage':
                this.checkDamageHack(playerId, data);
                break;
            case 'resource_change':
                this.checkResourceHack(playerId, data);
                break;
            case 'level_complete':
                this.checkSpeedHack(playerId, data);
                break;
        }
    }
    
    // 检测伤害异常
    private checkDamageHack(playerId: string, data: { damage: number; expectedMax: number }): void {
        const multiplier = data.damage / data.expectedMax;
        if (multiplier > this.thresholds.maxDamageMultiplier) {
            this.flagSuspicious(playerId, CheatType.DAMAGE_HACK, {
                damage: data.damage,
                expectedMax: data.expectedMax,
                multiplier
            });
        }
    }
    
    // 检测资源异常
    private checkResourceHack(playerId: string, data: { type: string; change: number; newTotal: number }): void {
        // 检测异常大的资源变化
        if (Math.abs(data.change) > this.thresholds.maxResourceChange) {
            this.flagSuspicious(playerId, CheatType.RESOURCE_HACK, {
                resourceType: data.type,
                change: data.change,
                newTotal: data.newTotal
            });
        }
        
        // 检测资源是否为负数（不可能的情况）
        if (data.newTotal < 0) {
            this.flagSuspicious(playerId, CheatType.DATA_TAMPERING, {
                resourceType: data.type,
                newTotal: data.newTotal
            });
        }
    }
    
    // 检测速度异常
    private checkSpeedHack(playerId: string, data: { levelId: string; clearTime: number; expectedTime: number }): void {
        if (data.clearTime < this.thresholds.minClearTime) {
            this.flagSuspicious(playerId, CheatType.SPEED_HACK, {
                levelId: data.levelId,
                clearTime: data.clearTime,
                expectedTime: data.expectedTime
            });
        }
    }
    
    // 标记可疑行为
    private flagSuspicious(
        playerId: string,
        type: CheatType,
        evidence: any,
        confidence: number = 0.7
    ): void {
        const behavior = this.playerBehaviors.get(playerId);
        if (behavior) {
            behavior.suspiciousScore += 10;
        }
        
        const detection: CheatDetection = {
            type,
            playerId,
            confidence,
            evidence,
            detectedAt: Date.now(),
            action: this.determineAction(playerId, confidence)
        };
        
        if (!this.detections.has(playerId)) {
            this.detections.set(playerId, []);
        }
        this.detections.get(playerId)!.push(detection);
        
        // 立即处理高危检测
        if (confidence > 0.9) {
            this.handleHighRisk(playerId, detection);
        }
        
        console.warn(`[AntiCheat] Suspicious activity detected: ${type} for player ${playerId}`);
    }
    
    // 确定处理措施
    private determineAction(playerId: string, confidence: number): CheatDetection['action'] {
        const history = this.detections.get(playerId) || [];
        const recentDetections = history.filter(d => d.detectedAt > Date.now() - 24 * 60 * 60 * 1000);
        
        if (confidence > 0.95 || recentDetections.length >= 5) {
            return 'ban';
        } else if (confidence > 0.8 || recentDetections.length >= 3) {
            return 'suspend';
        } else if (confidence > 0.6 || recentDetections.length >= 1) {
            return 'warn';
        }
        return 'monitor';
    }
    
    // 处理高危检测
    private handleHighRisk(playerId: string, detection: CheatDetection): void {
        switch (detection.action) {
            case 'ban':
                console.error(`[AntiCheat] BAN player ${playerId} for ${detection.type}`);
                // TODO: 执行封号
                break;
            case 'suspend':
                console.error(`[AntiCheat] SUSPEND player ${playerId} for ${detection.type}`);
                // TODO: 执行临时封禁
                break;
            case 'warn':
                console.warn(`[AntiCheat] WARN player ${playerId} for ${detection.type}`);
                // TODO: 发送警告邮件
                break;
        }
    }
    
    // 获取玩家检测记录
    public getPlayerDetections(playerId: string): CheatDetection[] {
        return this.detections.get(playerId) || [];
    }
    
    // 获取可疑玩家列表
    public getSuspiciousPlayers(): { playerId: string; score: number; detections: CheatDetection[] }[] {
        const result: { playerId: string; score: number; detections: CheatDetection[] }[] = [];
        
        this.playerBehaviors.forEach((behavior, playerId) => {
            if (behavior.suspiciousScore > 20) {
                result.push({
                    playerId,
                    score: behavior.suspiciousScore,
                    detections: this.detections.get(playerId) || []
                });
            }
        });
        
        return result.sort((a, b) => b.score - a.score);
    }
    
    // 手动报告作弊
    public reportCheating(
        reporterId: string,
        targetId: string,
        reason: string,
        evidence?: any
    ): void {
        console.log(`[AntiCheat] Report from ${reporterId} against ${targetId}: ${reason}`);
        
        // 增加被举报玩家可疑度
        if (!this.playerBehaviors.has(targetId)) {
            this.playerBehaviors.set(targetId, {
                actions: 0,
                lastActionTime: Date.now(),
                suspiciousScore: 5
            });
        } else {
            this.playerBehaviors.get(targetId)!.suspiciousScore += 5;
        }
    }
    
    // 清除检测记录（申诉成功后）
    public clearDetections(playerId: string): void {
        this.detections.delete(playerId);
        this.playerBehaviors.delete(playerId);
    }
    
    // 调整检测阈值
    public updateThresholds(newThresholds: Partial<typeof this.thresholds>): void {
        Object.assign(this.thresholds, newThresholds);
    }
}

// 单例
export const antiCheatSystem = new AntiCheatSystem();
