/**
 * 活动系统
 * 限时活动、节日活动、运营活动
 */

export enum EventType {
    LOGIN = 'login',           // 登录活动
    CONSUME = 'consume',       // 消费活动
    RECHARGE = 'recharge',     // 充值活动
    BATTLE = 'battle',         // 战斗活动
    SUMMON = 'summon',         // 召唤活动
    EXCHANGE = 'exchange',     // 兑换活动
    RANKING = 'ranking',       // 排行榜活动
    STORY = 'story',           // 剧情活动
    MINIGAME = 'minigame'      // 小游戏活动
}

export enum EventStatus {
    UPCOMING = 'upcoming',     // 即将开始
    ACTIVE = 'active',         // 进行中
    ENDED = 'ended'            // 已结束
}

export interface EventReward {
    id: string;
    name: string;
    description: string;
    
    // 达成条件
    requirement: {
        type: string;
        value: number;
    };
    
    // 奖励内容
    rewards: {
        itemId: string;
        count: number;
    }[];
    
    // 领取状态
    isClaimed: boolean;
    progress: number;
}

export interface GameEvent {
    id: string;
    type: EventType;
    name: string;
    description: string;
    
    // 时间
    startTime: number;
    endTime: number;
    
    // 状态
    status: EventStatus;
    
    // 奖励列表
    rewards: EventReward[];
    
    // 活动特殊数据
    extraData?: any;
}

export class EventSystem {
    private events: Map<string, GameEvent> = new Map();
    private playerEventProgress: Map<string, Map<string, number>> = new Map();  // eventId -> { requirementType -> progress }
    
    // 创建活动
    public createEvent(
        id: string,
        type: EventType,
        name: string,
        description: string,
        startTime: number,
        endTime: number,
        rewards: Omit<EventReward, 'isClaimed' | 'progress'>[]
    ): GameEvent {
        const event: GameEvent = {
            id,
            type,
            name,
            description,
            startTime,
            endTime,
            status: EventStatus.UPCOMING,
            rewards: rewards.map(r => ({
                ...r,
                isClaimed: false,
                progress: 0
            }))
        };
        
        this.events.set(id, event);
        this.updateEventStatus(event);
        
        return event;
    }
    
    // 更新活动状态
    private updateEventStatus(event: GameEvent): void {
        const now = Date.now();
        
        if (now < event.startTime) {
            event.status = EventStatus.UPCOMING;
        } else if (now >= event.startTime && now <= event.endTime) {
            event.status = EventStatus.ACTIVE;
        } else {
            event.status = EventStatus.ENDED;
        }
    }
    
    // 获取活动列表
    public getEvents(
        status?: EventStatus,
        type?: EventType
    ): GameEvent[] {
        // 先更新所有活动状态
        this.events.forEach(event => this.updateEventStatus(event));
        
        let events = Array.from(this.events.values());
        
        if (status) {
            events = events.filter(e => e.status === status);
        }
        
        if (type) {
            events = events.filter(e => e.type === type);
        }
        
        // 按状态和时间排序
        return events.sort((a, b) => {
            // 进行中的优先
            if (a.status !== b.status) {
                const statusOrder = {
                    [EventStatus.ACTIVE]: 0,
                    [EventStatus.UPCOMING]: 1,
                    [EventStatus.ENDED]: 2
                };
                return statusOrder[a.status] - statusOrder[b.status];
            }
            return b.startTime - a.startTime;
        });
    }
    
    // 获取活动详情
    public getEvent(eventId: string): GameEvent | null {
        const event = this.events.get(eventId);
        if (event) {
            this.updateEventStatus(event);
        }
        return event || null;
    }
    
    // 更新活动进度
    public updateProgress(
        eventId: string,
        playerId: string,
        requirementType: string,
        progress: number
    ): void {
        const event = this.events.get(eventId);
        if (!event || event.status !== EventStatus.ACTIVE) return;
        
        // 更新对应奖励项的进度
        event.rewards.forEach(reward => {
            if (reward.requirement.type === requirementType) {
                reward.progress = Math.min(progress, reward.requirement.value);
            }
        });
        
        // 保存到玩家进度
        if (!this.playerEventProgress.has(playerId)) {
            this.playerEventProgress.set(playerId, new Map());
        }
        const playerProgress = this.playerEventProgress.get(playerId)!;
        playerProgress.set(`${eventId}_${requirementType}`, progress);
    }
    
    // 增加活动进度
    public addProgress(
        eventId: string,
        playerId: string,
        requirementType: string,
        amount: number = 1
    ): void {
        const current = this.getProgress(eventId, playerId, requirementType);
        this.updateProgress(eventId, playerId, requirementType, current + amount);
    }
    
    // 获取进度
    private getProgress(
        eventId: string,
        playerId: string,
        requirementType: string
    ): number {
        const playerProgress = this.playerEventProgress.get(playerId);
        if (!playerProgress) return 0;
        return playerProgress.get(`${eventId}_${requirementType}`) || 0;
    }
    
    // 领取奖励
    public claimReward(
        eventId: string,
        rewardId: string
    ): {
        success: boolean;
        rewards?: any[];
        error?: string;
    } {
        const event = this.events.get(eventId);
        if (!event) {
            return { success: false, error: '活动不存在' };
        }
        
        if (event.status !== EventStatus.ACTIVE) {
            return { success: false, error: '活动未开始或已结束' };
        }
        
        const reward = event.rewards.find(r => r.id === rewardId);
        if (!reward) {
            return { success: false, error: '奖励不存在' };
        }
        
        if (reward.isClaimed) {
            return { success: false, error: '已领取' };
        }
        
        if (reward.progress < reward.requirement.value) {
            return { success: false, error: '进度不足' };
        }
        
        reward.isClaimed = true;
        return { success: true, rewards: reward.rewards };
    }
    
    // 获取可领取的奖励数量
    public getClaimableRewardCount(eventId: string): number {
        const event = this.events.get(eventId);
        if (!event || event.status !== EventStatus.ACTIVE) return 0;
        
        return event.rewards.filter(
            r => !r.isClaimed && r.progress >= r.requirement.value
        ).length;
    }
    
    // 创建示例活动
    public createSampleEvents(): void {
        const now = Date.now();
        const day = 24 * 60 * 60 * 1000;
        
        // 登录活动
        this.createEvent(
            'event_login_001',
            EventType.LOGIN,
            '七日登录',
            '连续登录7天领取丰厚奖励',
            now,
            now + 7 * day,
            [
                { id: 'reward_1', name: '第1天', description: '登录1天', requirement: { type: 'login_days', value: 1 }, rewards: [{ itemId: 'gold', count: 1000 }] },
                { id: 'reward_2', name: '第2天', description: '登录2天', requirement: { type: 'login_days', value: 2 }, rewards: [{ itemId: 'soul_crystal', count: 100 }] },
                { id: 'reward_3', name: '第3天', description: '登录3天', requirement: { type: 'login_days', value: 3 }, rewards: [{ itemId: 'gacha_ticket', count: 1 }] },
                { id: 'reward_7', name: '第7天', description: '登录7天', requirement: { type: 'login_days', value: 7 }, rewards: [{ itemId: 'random_epic_card', count: 1 }] }
            ]
        );
        
        // 战斗活动
        this.createEvent(
            'event_battle_001',
            EventType.BATTLE,
            '战斗狂人',
            '完成指定战斗次数领取奖励',
            now,
            now + 3 * day,
            [
                { id: 'reward_10', name: '初试锋芒', description: '战斗10次', requirement: { type: 'battle_count', value: 10 }, rewards: [{ itemId: 'gold', count: 5000 }] },
                { id: 'reward_50', name: '身经百战', description: '战斗50次', requirement: { type: 'battle_count', value: 50 }, rewards: [{ itemId: 'memory_dust', count: 50 }] },
                { id: 'reward_100', name: '战斗狂人', description: '战斗100次', requirement: { type: 'battle_count', value: 100 }, rewards: [{ itemId: 'soul_crystal', count: 500 }] }
            ]
        );
        
        // 召唤活动
        this.createEvent(
            'event_summon_001',
            EventType.SUMMON,
            '召唤盛典',
            '活动期间召唤次数达标领取奖励',
            now,
            now + 5 * day,
            [
                { id: 'reward_10', name: '初出茅庐', description: '召唤10次', requirement: { type: 'summon_count', value: 10 }, rewards: [{ itemId: 'memory_dust', count: 20 }] },
                { id: 'reward_30', name: '召唤大师', description: '召唤30次', requirement: { type: 'summon_count', value: 30 }, rewards: [{ itemId: 'gacha_ticket', count: 5 }] },
                { id: 'reward_100', name: '召唤之神', description: '召唤100次', requirement: { type: 'summon_count', value: 100 }, rewards: [{ itemId: 'random_legend_card', count: 1 }] }
            ]
        );
    }
    
    // 清理已结束活动
    public cleanEndedEvents(): void {
        const now = Date.now();
        const threeDaysAgo = now - 3 * 24 * 60 * 60 * 1000;
        
        this.events.forEach((event, id) => {
            if (event.status === EventStatus.ENDED && event.endTime < threeDaysAgo) {
                this.events.delete(id);
            }
        });
    }
}

// 单例
export const eventSystem = new EventSystem();
