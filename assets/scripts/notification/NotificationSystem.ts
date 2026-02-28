/**
 * 推送通知系统
 * 本地通知、定时提醒
 */

export enum NotificationType {
    ENERGY_FULL = 'energy_full',       // 体力恢复满
    DAILY_RESET = 'daily_reset',       // 每日重置
    EVENT_START = 'event_start',       // 活动开始
    EVENT_END = 'event_end',           // 活动结束
    GUILD_WAR = 'guild_war',           // 公会战
    FRIEND_REQUEST = 'friend_request', // 好友申请
    MAIL = 'mail',                     // 新邮件
    OFFLINE_REWARD = 'offline_reward'  // 离线收益可领取
}

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    body: string;
    
    // 触发条件
    trigger: {
        type: 'immediate' | 'scheduled' | 'condition';
        time?: number;           // 定时触发
        condition?: string;      // 条件触发
    };
    
    // 操作
    action: {
        type: string;
        data?: any;
    };
    
    // 显示选项
    options: {
        badge?: number;
        sound?: string;
        priority: 'low' | 'normal' | 'high';
    };
}

export interface ScheduledNotification {
    id: string;
    playerId: string;
    notification: Notification;
    scheduledTime: number;
    isDelivered: boolean;
}

export class NotificationSystem {
    private notifications: Map<string, Notification> = new Map();
    private scheduled: Map<string, ScheduledNotification[]> = new Map();  // playerId -> notifications
    private playerPreferences: Map<string, {
        enabled: boolean;
        types: NotificationType[];
        quietHours: { start: number; end: number };
    }> = new Map();
    
    constructor() {
        this.initializeDefaultNotifications();
    }
    
    private initializeDefaultNotifications(): void {
        const defaults: Notification[] = [
            {
                id: 'notif_energy_full',
                type: NotificationType.ENERGY_FULL,
                title: '体力已满',
                body: '你的体力已恢复满，快来继续冒险吧！',
                trigger: { type: 'condition', condition: 'energy_full' },
                action: { type: 'open_main' },
                options: { priority: 'normal' }
            },
            {
                id: 'notif_daily_reset',
                type: NotificationType.DAILY_RESET,
                title: '新的一天',
                body: '每日任务和奖励已刷新，快来领取！',
                trigger: { type: 'scheduled', time: this.getDailyResetTime() },
                action: { type: 'open_daily' },
                options: { priority: 'high' }
            },
            {
                id: 'notif_event_start',
                type: NotificationType.EVENT_START,
                title: '活动开始',
                body: '限时活动{eventName}已经开始，不要错过！',
                trigger: { type: 'scheduled', time: 0 },
                action: { type: 'open_event' },
                options: { priority: 'high' }
            },
            {
                id: 'notif_guild_war',
                type: NotificationType.GUILD_WAR,
                title: '公会战提醒',
                body: '公会战即将开始，请做好准备！',
                trigger: { type: 'scheduled', time: 0 },
                action: { type: 'open_guild' },
                options: { priority: 'high', sound: 'alert' }
            },
            {
                id: 'notif_offline_reward',
                type: NotificationType.OFFLINE_REWARD,
                title: '离线收益',
                body: '你已累计8小时离线收益，快来领取！',
                trigger: { type: 'condition', condition: 'offline_8h' },
                action: { type: 'open_idle' },
                options: { priority: 'normal' }
            }
        ];
        
        defaults.forEach(n => this.notifications.set(n.id, n));
    }
    
    // 获取每日重置时间
    private getDailyResetTime(): number {
        const now = new Date();
        now.setHours(5, 0, 0, 0);
        if (now.getTime() < Date.now()) {
            now.setDate(now.getDate() + 1);
        }
        return now.getTime();
    }
    
    // 安排通知
    public schedule(
        playerId: string,
        notificationId: string,
        delayMs: number,
        customData?: any
    ): string | null {
        const notification = this.notifications.get(notificationId);
        if (!notification) return null;
        
        const scheduleId = `SCH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const scheduled: ScheduledNotification = {
            id: scheduleId,
            playerId,
            notification: {
                ...notification,
                body: customData 
                    ? this.fillPlaceholders(notification.body, customData)
                    : notification.body
            },
            scheduledTime: Date.now() + delayMs,
            isDelivered: false
        };
        
        if (!this.scheduled.has(playerId)) {
            this.scheduled.set(playerId, []);
        }
        this.scheduled.get(playerId)!.push(scheduled);
        
        return scheduleId;
    }
    
    // 填充占位符
    private fillPlaceholders(text: string, data: Record<string, string>): string {
        let result = text;
        Object.entries(data).forEach(([key, value]) => {
            result = result.replace(`{${key}}`, value);
        });
        return result;
    }
    
    // 取消通知
    public cancel(playerId: string, scheduleId: string): boolean {
        const schedules = this.scheduled.get(playerId);
        if (!schedules) return false;
        
        const index = schedules.findIndex(s => s.id === scheduleId);
        if (index > -1) {
            schedules.splice(index, 1);
            return true;
        }
        return false;
    }
    
    // 检查并发送到期通知
    public checkAndDeliver(): { playerId: string; notification: Notification }[] {
        const now = Date.now();
        const toDeliver: { playerId: string; notification: Notification }[] = [];
        
        this.scheduled.forEach((schedules, playerId) => {
            schedules.forEach(schedule => {
                if (!schedule.isDelivered && schedule.scheduledTime <= now) {
                    // 检查用户偏好
                    if (this.shouldDeliverToPlayer(playerId, schedule.notification)) {
                        toDeliver.push({
                            playerId,
                            notification: schedule.notification
                        });
                        schedule.isDelivered = true;
                    }
                }
            });
            
            // 清理已发送的通知
            const pending = schedules.filter(s => !s.isDelivered);
            this.scheduled.set(playerId, pending);
        });
        
        return toDeliver;
    }
    
    // 检查是否应该发送给玩家
    private shouldDeliverToPlayer(playerId: string, notification: Notification): boolean {
        const prefs = this.playerPreferences.get(playerId);
        if (!prefs) return true;  // 默认允许
        
        if (!prefs.enabled) return false;
        if (!prefs.types.includes(notification.type)) return false;
        
        // 检查静音时段
        const hour = new Date().getHours();
        if (hour >= prefs.quietHours.start && hour < prefs.quietHours.end) {
            return false;
        }
        
        return true;
    }
    
    // 发送本地通知
    public async sendLocalNotification(
        title: string,
        body: string,
        options?: { badge?: number; sound?: string }
    ): Promise<boolean> {
        // TODO: 调用平台原生通知API
        console.log(`[Notification] ${title}: ${body}`);
        return true;
    }
    
    // 设置玩家偏好
    public setPlayerPreference(
        playerId: string,
        enabled: boolean,
        types: NotificationType[],
        quietHours?: { start: number; end: number }
    ): void {
        this.playerPreferences.set(playerId, {
            enabled,
            types,
            quietHours: quietHours || { start: 23, end: 8 }
        });
    }
    
    // 立即发送通知
    public sendImmediate(
        playerId: string,
        type: NotificationType,
        title: string,
        body: string,
        action?: any
    ): void {
        const notification: Notification = {
            id: `immediate_${Date.now()}`,
            type,
            title,
            body,
            trigger: { type: 'immediate' },
            action: action || { type: 'open_main' },
            options: { priority: 'normal' }
        };
        
        if (this.shouldDeliverToPlayer(playerId, notification)) {
            this.sendLocalNotification(title, body);
        }
    }
    
    // 获取待发送通知
    public getPendingNotifications(playerId: string): ScheduledNotification[] {
        const schedules = this.scheduled.get(playerId) || [];
        return schedules.filter(s => !s.isDelivered);
    }
}

// 单例
export const notificationSystem = new NotificationSystem();
