/**
 * 兑换码系统
 * 礼包码、活动码、CDK兑换
 */

export enum RedeemCodeType {
    GENERAL = 'general',       // 通用码（所有人可用）
    ONE_TIME = 'one_time',     // 一次性码（用完失效）
    LIMIT = 'limit',           // 限量码（有数量限制）
    VIP = 'vip',               // VIP专属
    TIME_LIMIT = 'time_limit'  // 限时码
}

export interface RedeemCode {
    code: string;                    // 兑换码（如：VIP666）
    type: RedeemCodeType;
    description: string;
    
    // 奖励内容
    rewards: {
        gold?: number;
        soulCrystal?: number;
        items?: { itemId: string; count: number }[];
        cards?: string[];
        vipExp?: number;
    };
    
    // 限制条件
    limits: {
        maxUses?: number;            // 最大使用次数（通用码）
        usedCount: number;           // 已使用次数
        startTime?: number;          // 开始时间
        endTime?: number;            // 结束时间
        minLevel?: number;           // 最低等级
        maxLevel?: number;           // 最高等级
        vipLevel?: number;           // VIP等级要求
    };
    
    // 状态
    isActive: boolean;
    createdAt: number;
}

export interface RedeemHistory {
    code: string;
    playerId: string;
    playerName: string;
    redeemedAt: number;
    rewards: any;
}

export class RedeemCodeSystem {
    private codes: Map<string, RedeemCode> = new Map();
    private playerRedeemed: Map<string, Set<string>> = new Map();  // playerId -> Set<code>
    private redeemHistory: RedeemHistory[] = [];
    
    // 创建兑换码
    public createCode(
        code: string,
        type: RedeemCodeType,
        description: string,
        rewards: RedeemCode['rewards'],
        limits: Partial<RedeemCode['limits']> = {}
    ): RedeemCode {
        // 检查code是否已存在
        if (this.codes.has(code)) {
            throw new Error(`兑换码 ${code} 已存在`);
        }
        
        const redeemCode: RedeemCode = {
            code: code.toUpperCase(),
            type,
            description,
            rewards,
            limits: {
                usedCount: 0,
                ...limits
            },
            isActive: true,
            createdAt: Date.now()
        };
        
        this.codes.set(code.toUpperCase(), redeemCode);
        return redeemCode;
    }
    
    // 批量生成一次性兑换码
    public generateOneTimeCodes(
        prefix: string,
        count: number,
        description: string,
        rewards: RedeemCode['rewards'],
        limits: Partial<RedeemCode['limits']> = {}
    ): string[] {
        const codes: string[] = [];
        
        for (let i = 0; i < count; i++) {
            // 生成随机后缀
            const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
            const code = `${prefix}${suffix}`;
            
            try {
                this.createCode(code, RedeemCodeType.ONE_TIME, description, rewards, {
                    maxUses: 1,
                    ...limits
                });
                codes.push(code);
            } catch (e) {
                // 如果重复，重试
                i--;
            }
        }
        
        return codes;
    }
    
    // 使用兑换码
    public redeem(
        code: string,
        playerId: string,
        playerName: string,
        playerLevel: number,
        vipLevel: number
    ): {
        success: boolean;
        rewards?: any;
        error?: string;
    } {
        const upperCode = code.toUpperCase();
        const redeemCode = this.codes.get(upperCode);
        
        // 检查兑换码是否存在
        if (!redeemCode) {
            return { success: false, error: '兑换码不存在' };
        }
        
        // 检查是否激活
        if (!redeemCode.isActive) {
            return { success: false, error: '兑换码已失效' };
        }
        
        // 检查时间限制
        const now = Date.now();
        if (redeemCode.limits.startTime && now < redeemCode.limits.startTime) {
            return { success: false, error: '兑换码尚未生效' };
        }
        if (redeemCode.limits.endTime && now > redeemCode.limits.endTime) {
            return { success: false, error: '兑换码已过期' };
        }
        
        // 检查等级限制
        if (redeemCode.limits.minLevel && playerLevel < redeemCode.limits.minLevel) {
            return { success: false, error: `需要达到${redeemCode.limits.minLevel}级` };
        }
        if (redeemCode.limits.maxLevel && playerLevel > redeemCode.limits.maxLevel) {
            return { success: false, error: `超过等级限制` };
        }
        
        // 检查VIP限制
        if (redeemCode.limits.vipLevel && vipLevel < redeemCode.limits.vipLevel) {
            return { success: false, error: `需要VIP${redeemCode.limits.vipLevel}` };
        }
        
        // 检查使用次数限制
        if (redeemCode.limits.maxUses && redeemCode.limits.usedCount >= redeemCode.limits.maxUses) {
            return { success: false, error: '兑换码已达使用上限' };
        }
        
        // 检查玩家是否已使用过
        const playerCodes = this.playerRedeemed.get(playerId);
        if (playerCodes?.has(upperCode)) {
            return { success: false, error: '您已使用过此兑换码' };
        }
        
        // 标记已使用
        if (!this.playerRedeemed.has(playerId)) {
            this.playerRedeemed.set(playerId, new Set());
        }
        this.playerRedeemed.get(playerId)!.add(upperCode);
        
        // 更新使用次数
        redeemCode.limits.usedCount++;
        
        // 一次性码用完即失效
        if (redeemCode.type === RedeemCodeType.ONE_TIME) {
            redeemCode.isActive = false;
        }
        
        // 记录历史
        this.redeemHistory.push({
            code: upperCode,
            playerId,
            playerName,
            redeemedAt: now,
            rewards: redeemCode.rewards
        });
        
        return { success: true, rewards: redeemCode.rewards };
    }
    
    // 获取玩家已使用的兑换码
    public getPlayerRedeemedCodes(playerId: string): string[] {
        const codes = this.playerRedeemed.get(playerId);
        return codes ? Array.from(codes) : [];
    }
    
    // 检查玩家是否可使用某兑换码
    public canRedeem(code: string, playerId: string): {
        canUse: boolean;
        reason?: string;
    } {
        const upperCode = code.toUpperCase();
        const redeemCode = this.codes.get(upperCode);
        
        if (!redeemCode) {
            return { canUse: false, reason: '兑换码不存在' };
        }
        
        const playerCodes = this.playerRedeemed.get(playerId);
        if (playerCodes?.has(upperCode)) {
            return { canUse: false, reason: '已使用过' };
        }
        
        if (!redeemCode.isActive) {
            return { canUse: false, reason: '已失效' };
        }
        
        const now = Date.now();
        if (redeemCode.limits.endTime && now > redeemCode.limits.endTime) {
            return { canUse: false, reason: '已过期' };
        }
        
        if (redeemCode.limits.maxUses && redeemCode.limits.usedCount >= redeemCode.limits.maxUses) {
            return { canUse: false, reason: '已达上限' };
        }
        
        return { canUse: true };
    }
    
    // 禁用兑换码
    public deactivateCode(code: string): boolean {
        const redeemCode = this.codes.get(code.toUpperCase());
        if (!redeemCode) return false;
        
        redeemCode.isActive = false;
        return true;
    }
    
    // 删除兑换码
    public deleteCode(code: string): boolean {
        return this.codes.delete(code.toUpperCase());
    }
    
    // 获取兑换码列表（管理用）
    public getAllCodes(): RedeemCode[] {
        return Array.from(this.codes.values()).sort(
            (a, b) => b.createdAt - a.createdAt
        );
    }
    
    // 获取兑换码使用统计
    public getCodeStats(code: string): {
        totalUses: number;
        uniqueUsers: number;
        recentUses: number;
    } | null {
        const redeemCode = this.codes.get(code.toUpperCase());
        if (!redeemCode) return null;
        
        const history = this.redeemHistory.filter(h => h.code === code.toUpperCase());
        const uniqueUsers = new Set(history.map(h => h.playerId)).size;
        const recentUses = history.filter(
            h => h.redeemedAt > Date.now() - 7 * 24 * 60 * 60 * 1000
        ).length;
        
        return {
            totalUses: redeemCode.limits.usedCount,
            uniqueUsers,
            recentUses
        };
    }
    
    // 创建常用兑换码
    public createDefaultCodes(): void {
        // 新手礼包
        this.createCode(
            'NEWBIE',
            RedeemCodeType.GENERAL,
            '新手礼包码',
            { gold: 10000, soulCrystal: 300, items: [{ itemId: 'gacha_ticket', count: 3 }] },
            { maxUses: 999999 }
        );
        
        // VIP礼包
        this.createCode(
            'VIP666',
            RedeemCodeType.GENERAL,
            'VIP福利礼包',
            { gold: 50000, soulCrystal: 500, items: [{ itemId: 'exp_potion', count: 5 }] },
            { maxUses: 999999, vipLevel: 1 }
        );
        
        // 测试码
        this.createCode(
            'TEST',
            RedeemCodeType.GENERAL,
            '测试专用码',
            { gold: 999999, soulCrystal: 9999 },
            { maxUses: 100 }
        );
    }
}

// 单例
export const redeemCodeSystem = new RedeemCodeSystem();
