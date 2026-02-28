/**
 * 数据统计与分析系统
 * 追踪玩家行为、游戏数据、运营指标
 */

export enum AnalyticsEvent {
    // 登录相关
    LOGIN = 'login',
    LOGOUT = 'logout',
    REGISTER = 'register',
    
    // 战斗相关
    BATTLE_START = 'battle_start',
    BATTLE_WIN = 'battle_win',
    BATTLE_LOSE = 'battle_lose',
    
    // 养成相关
    CARD_LEVEL_UP = 'card_level_up',
    CARD_AWAKEN = 'card_awaken',
    EQUIP_ENHANCE = 'equip_enhance',
    
    // 抽卡相关
    GACHA_SINGLE = 'gacha_single',
    GACHA_TEN = 'gacha_ten',
    GACHA_RESULT = 'gacha_result',
    
    // 经济相关
    GOLD_EARN = 'gold_earn',
    GOLD_CONSUME = 'gold_consume',
    CRYSTAL_EARN = 'crystal_earn',
    CRYSTAL_CONSUME = 'crystal_consume',
    
    // 社交相关
    FRIEND_ADD = 'friend_add',
    GUILD_JOIN = 'guild_join',
    CHAT_SEND = 'chat_send',
    
    // 关卡相关
    LEVEL_COMPLETE = 'level_complete',
    TOWER_FLOOR = 'tower_floor',
    DUNGEON_CLEAR = 'dungeon_clear',
    
    // 商城相关
    SHOP_BUY = 'shop_buy',
    RECHARGE = 'recharge',
    
    // 系统相关
    TUTORIAL_COMPLETE = 'tutorial_complete',
    GUIDE_CLICK = 'guide_click',
    ERROR = 'error'
}

export interface AnalyticsData {
    event: AnalyticsEvent;
    playerId: string;
    timestamp: number;
    data: any;
    
    // 设备信息
    device?: {
        platform: string;
        version: string;
        resolution: string;
    };
    
    // 会话信息
    sessionId: string;
    sessionDuration: number;
}

export class AnalyticsSystem {
    private eventQueue: AnalyticsData[] = [];
    private playerSessions: Map<string, {
        startTime: number;
        events: number;
    }> = new Map();
    
    // 实时统计数据
    private stats = {
        todayLogin: 0,
        todayNewPlayers: 0,
        todayRecharge: 0,
        todayActive: new Set<string>(),
        
        totalBattles: 0,
        totalGacha: 0,
        totalGoldEarned: 0,
        totalGoldConsumed: 0,
        
        errorCount: 0
    };
    
    // 追踪事件
    public track(
        event: AnalyticsEvent,
        playerId: string,
        data: any = {}
    ): void {
        const now = Date.now();
        
        // 更新会话
        if (!this.playerSessions.has(playerId)) {
            this.playerSessions.set(playerId, {
                startTime: now,
                events: 0
            });
        }
        const session = this.playerSessions.get(playerId)!;
        session.events++;
        
        const analyticsData: AnalyticsData = {
            event,
            playerId,
            timestamp: now,
            data,
            sessionId: `${playerId}_${session.startTime}`,
            sessionDuration: now - session.startTime
        };
        
        this.eventQueue.push(analyticsData);
        
        // 更新实时统计
        this.updateRealTimeStats(event, playerId, data);
        
        // 队列过大时刷新
        if (this.eventQueue.length >= 100) {
            this.flush();
        }
    }
    
    // 更新实时统计
    private updateRealTimeStats(
        event: AnalyticsEvent,
        playerId: string,
        data: any
    ): void {
        switch (event) {
            case AnalyticsEvent.LOGIN:
                this.stats.todayLogin++;
                this.stats.todayActive.add(playerId);
                break;
            case AnalyticsEvent.REGISTER:
                this.stats.todayNewPlayers++;
                break;
            case AnalyticsEvent.RECHARGE:
                this.stats.todayRecharge += data.amount || 0;
                break;
            case AnalyticsEvent.BATTLE_START:
                this.stats.totalBattles++;
                break;
            case AnalyticsEvent.GACHA_SINGLE:
            case AnalyticsEvent.GACHA_TEN:
                this.stats.totalGacha++;
                break;
            case AnalyticsEvent.GOLD_EARN:
                this.stats.totalGoldEarned += data.amount || 0;
                break;
            case AnalyticsEvent.GOLD_CONSUME:
                this.stats.totalGoldConsumed += data.amount || 0;
                break;
            case AnalyticsEvent.ERROR:
                this.stats.errorCount++;
                break;
        }
    }
    
    // 刷新数据（发送到服务器或存储）
    public flush(): void {
        if (this.eventQueue.length === 0) return;
        
        // TODO: 发送到分析服务器或写入本地存储
        console.log(`[Analytics] Flushing ${this.eventQueue.length} events`);
        
        // 清空队列
        this.eventQueue = [];
    }
    
    // 开始会话
    public startSession(playerId: string): void {
        this.playerSessions.set(playerId, {
            startTime: Date.now(),
            events: 0
        });
        this.track(AnalyticsEvent.LOGIN, playerId);
    }
    
    // 结束会话
    public endSession(playerId: string): void {
        const session = this.playerSessions.get(playerId);
        if (session) {
            this.track(AnalyticsEvent.LOGOUT, playerId, {
                duration: Date.now() - session.startTime,
                events: session.events
            });
            this.flush();
            this.playerSessions.delete(playerId);
        }
    }
    
    // 获取实时统计
    public getRealTimeStats(): {
        todayLogin: number;
        todayNewPlayers: number;
        todayRecharge: number;
        todayActive: number;
        totalBattles: number;
        totalGacha: number;
        errorCount: number;
    } {
        return {
            todayLogin: this.stats.todayLogin,
            todayNewPlayers: this.stats.todayNewPlayers,
            todayRecharge: this.stats.todayRecharge,
            todayActive: this.stats.todayActive.size,
            totalBattles: this.stats.totalBattles,
            totalGacha: this.stats.totalGacha,
            errorCount: this.stats.errorCount
        };
    }
    
    // 每日重置
    public dailyReset(): void {
        this.stats.todayLogin = 0;
        this.stats.todayNewPlayers = 0;
        this.stats.todayRecharge = 0;
        this.stats.todayActive.clear();
    }
    
    // 追踪玩家属性变化
    public trackPropertyChange(
        playerId: string,
        property: string,
        oldValue: number,
        newValue: number
    ): void {
        this.track(AnalyticsEvent.GOLD_EARN, playerId, {
            property,
            change: newValue - oldValue,
            oldValue,
            newValue
        });
    }
    
    // 追踪错误
    public trackError(
        playerId: string,
        errorType: string,
        errorMessage: string,
        stackTrace?: string
    ): void {
        this.track(AnalyticsEvent.ERROR, playerId, {
            errorType,
            errorMessage,
            stackTrace
        });
    }
    
    // 追踪关卡流失
    public trackLevelFunnel(
        playerId: string,
        chapterId: number,
        levelId: number,
        action: 'start' | 'win' | 'lose' | 'abandon'
    ): void {
        this.track(AnalyticsEvent.LEVEL_COMPLETE, playerId, {
            chapterId,
            levelId,
            action
        });
    }
    
    // 追踪付费漏斗
    public trackPaymentFunnel(
        playerId: string,
        step: 'view' | 'click' | 'purchase' | 'complete',
        productId?: string,
        amount?: number
    ): void {
        this.track(AnalyticsEvent.RECHARGE, playerId, {
            step,
            productId,
            amount
        });
    }
}

// 单例
export const analyticsSystem = new AnalyticsSystem();
