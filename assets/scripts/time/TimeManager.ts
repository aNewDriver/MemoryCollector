/**
 * 服务器时间管理器
 * 处理时间同步、倒计时、时区转换
 */

export class TimeManager {
    private serverTimeOffset: number = 0;  // 与服务器的时间差（毫秒）
    private lastSyncTime: number = 0;
    private isSynced: boolean = false;
    
    // 每日重置时间（5:00 AM）
    private readonly DAILY_RESET_HOUR = 5;
    
    // 获取当前时间（已同步服务器时间）
    public now(): number {
        return Date.now() + this.serverTimeOffset;
    }
    
    // 获取当前日期字符串
    public today(): string {
        return this.formatDate(this.now());
    }
    
    // 格式化日期
    public formatDate(timestamp: number): string {
        const date = new Date(timestamp);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
    
    // 格式化时间
    public formatTime(timestamp: number): string {
        const date = new Date(timestamp);
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    }
    
    // 格式化日期时间
    public formatDateTime(timestamp: number): string {
        return `${this.formatDate(timestamp)} ${this.formatTime(timestamp)}`;
    }
    
    // 与服务器同步时间
    public syncWithServer(serverTimestamp: number): void {
        const localTime = Date.now();
        this.serverTimeOffset = serverTimestamp - localTime;
        this.lastSyncTime = localTime;
        this.isSynced = true;
        
        console.log(`[Time] Synced with server. Offset: ${this.serverTimeOffset}ms`);
    }
    
    // 异步获取服务器时间并同步
    public async fetchServerTime(url: string): Promise<boolean> {
        try {
            const startTime = Date.now();
            // TODO: 实际网络请求
            // const response = await fetch(url);
            // const { serverTime } = await response.json();
            
            // 模拟服务器时间
            const serverTime = Date.now();
            const latency = (Date.now() - startTime) / 2;
            
            this.syncWithServer(serverTime + latency);
            return true;
        } catch (e) {
            console.error('[Time] Failed to sync with server:', e);
            return false;
        }
    }
    
    // 获取下次每日重置时间
    public getNextDailyReset(): number {
        const now = this.now();
        const date = new Date(now);
        
        date.setHours(this.DAILY_RESET_HOUR, 0, 0, 0);
        
        // 如果今天的重置时间已过，设置为明天
        if (date.getTime() <= now) {
            date.setDate(date.getDate() + 1);
        }
        
        return date.getTime();
    }
    
    // 获取距离下次重置的倒计时（毫秒）
    public getDailyResetCountdown(): number {
        return this.getNextDailyReset() - this.now();
    }
    
    // 格式化倒计时
    public formatCountdown(ms: number): string {
        if (ms <= 0) return '00:00:00';
        
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) {
            return `${days}天 ${String(hours % 24).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
        }
        
        return `${String(hours).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    }
    
    // 检查是否跨天
    public isNewDay(lastTimestamp: number): boolean {
        const lastDate = this.formatDate(lastTimestamp);
        const today = this.today();
        return lastDate !== today;
    }
    
    // 检查是否在活动时间
    public isInTimeRange(startTime: number, endTime: number): boolean {
        const now = this.now();
        return now >= startTime && now <= endTime;
    }
    
    // 获取本周开始时间（周一）
    public getWeekStart(): number {
        const now = this.now();
        const date = new Date(now);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);  // 调整为周一开始
        date.setDate(diff);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    }
    
    // 获取本月开始时间
    public getMonthStart(): number {
        const now = this.now();
        const date = new Date(now);
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    }
    
    // 计算时间差（友好显示）
    public getTimeAgo(timestamp: number): string {
        const diff = this.now() - timestamp;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}天前`;
        if (hours > 0) return `${hours}小时前`;
        if (minutes > 0) return `${minutes}分钟前`;
        return '刚刚';
    }
    
    // 获取当前是星期几
    public getDayOfWeek(): number {
        return new Date(this.now()).getDay();
    }
    
    // 获取当前小时
    public getCurrentHour(): number {
        return new Date(this.now()).getHours();
    }
    
    // 检查是否在指定时间段内
    public isInHourRange(startHour: number, endHour: number): boolean {
        const hour = this.getCurrentHour();
        return hour >= startHour && hour < endHour;
    }
    
    // 添加指定天数
    public addDays(timestamp: number, days: number): number {
        return timestamp + days * 24 * 60 * 60 * 1000;
    }
    
    // 添加指定小时
    public addHours(timestamp: number, hours: number): number {
        return timestamp + hours * 60 * 60 * 1000;
    }
    
    // 获取同步状态
    public getSyncStatus(): {
        isSynced: boolean;
        offset: number;
        lastSync: number;
    } {
        return {
            isSynced: this.isSynced,
            offset: this.serverTimeOffset,
            lastSync: this.lastSyncTime
        };
    }
}

// 单例
export const timeManager = new TimeManager();
