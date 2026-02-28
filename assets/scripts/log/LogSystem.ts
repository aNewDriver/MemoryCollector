/**
 * 错误日志和崩溃报告系统
 * 收集错误信息，便于调试
 */

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    FATAL = 4
}

export interface LogEntry {
    id: string;
    timestamp: number;
    level: LogLevel;
    category: string;
    message: string;
    stack?: string;
    context?: any;
    playerId?: string;
    sessionId?: string;
}

export interface CrashReport {
    id: string;
    timestamp: number;
    error: string;
    stack: string;
    playerId?: string;
    deviceInfo: {
        platform: string;
        version: string;
        model?: string;
        memory?: number;
    };
    gameState?: any;
}

export class LogSystem {
    private logs: LogEntry[] = [];
    private maxLogCount: number = 1000;
    private currentLogLevel: LogLevel = LogLevel.DEBUG;
    private crashReports: CrashReport[] = [];
    private sessionId: string = '';
    
    constructor() {
        this.sessionId = `SES_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.setupErrorHandlers();
    }
    
    // 设置全局错误处理
    private setupErrorHandlers(): void {
        // 捕获未处理的Promise错误
        if (typeof window !== 'undefined') {
            window.addEventListener('unhandledrejection', (event) => {
                this.error('Promise', 'Unhandled promise rejection', event.reason);
            });
            
            // 捕获全局错误
            window.addEventListener('error', (event) => {
                this.fatal('Global', event.message, event.error);
            });
        }
    }
    
    // 记录日志
    private log(
        level: LogLevel,
        category: string,
        message: string,
        context?: any,
        playerId?: string
    ): void {
        if (level < this.currentLogLevel) return;
        
        const entry: LogEntry = {
            id: `LOG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            level,
            category,
            message,
            context,
            playerId,
            sessionId: this.sessionId
        };
        
        // 捕获错误堆栈
        if (level >= LogLevel.ERROR && context instanceof Error) {
            entry.stack = context.stack;
        }
        
        this.logs.push(entry);
        
        // 限制日志数量
        if (this.logs.length > this.maxLogCount) {
            this.logs.shift();
        }
        
        // 控制台输出
        this.outputToConsole(entry);
    }
    
    // 输出到控制台
    private outputToConsole(entry: LogEntry): void {
        const timestamp = new Date(entry.timestamp).toISOString();
        const prefix = `[${timestamp}] [${LogLevel[entry.level]}] [${entry.category}]`;
        
        switch (entry.level) {
            case LogLevel.DEBUG:
                console.debug(prefix, entry.message, entry.context || '');
                break;
            case LogLevel.INFO:
                console.info(prefix, entry.message, entry.context || '');
                break;
            case LogLevel.WARN:
                console.warn(prefix, entry.message, entry.context || '');
                break;
            case LogLevel.ERROR:
            case LogLevel.FATAL:
                console.error(prefix, entry.message, entry.stack || entry.context || '');
                break;
        }
    }
    
    // 各级别日志快捷方法
    public debug(category: string, message: string, context?: any, playerId?: string): void {
        this.log(LogLevel.DEBUG, category, message, context, playerId);
    }
    
    public info(category: string, message: string, context?: any, playerId?: string): void {
        this.log(LogLevel.INFO, category, message, context, playerId);
    }
    
    public warn(category: string, message: string, context?: any, playerId?: string): void {
        this.log(LogLevel.WARN, category, message, context, playerId);
    }
    
    public error(category: string, message: string, context?: any, playerId?: string): void {
        this.log(LogLevel.ERROR, category, message, context, playerId);
    }
    
    public fatal(category: string, message: string, context?: any, playerId?: string): void {
        this.log(LogLevel.FATAL, category, message, context, playerId);
        
        // 致命错误时生成崩溃报告
        this.generateCrashReport(message, context instanceof Error ? context : new Error(message), playerId);
    }
    
    // 生成崩溃报告
    private generateCrashReport(error: string, errorObj: Error, playerId?: string): void {
        const report: CrashReport = {
            id: `CRASH_${Date.now()}`,
            timestamp: Date.now(),
            error,
            stack: errorObj.stack || '',
            playerId,
            deviceInfo: this.getDeviceInfo(),
            gameState: this.getRecentLogs(50)
        };
        
        this.crashReports.push(report);
        
        // 自动上报（模拟）
        this.sendCrashReport(report);
    }
    
    // 获取设备信息
    private getDeviceInfo(): CrashReport['deviceInfo'] {
        return {
            platform: typeof navigator !== 'undefined' ? navigator.platform : 'unknown',
            version: '1.0.0',  // 游戏版本
            model: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
        };
    }
    
    // 发送崩溃报告
    private async sendCrashReport(report: CrashReport): Promise<void> {
        // TODO: 实际上报到服务器
        console.error('[CrashReport] Generated:', report.id);
    }
    
    // 获取日志
    public getLogs(
        options?: {
            level?: LogLevel;
            category?: string;
            playerId?: string;
            startTime?: number;
            endTime?: number;
            limit?: number;
        }
    ): LogEntry[] {
        let filtered = [...this.logs];
        
        if (options?.level !== undefined) {
            filtered = filtered.filter(l => l.level >= options.level!);
        }
        
        if (options?.category) {
            filtered = filtered.filter(l => l.category === options.category);
        }
        
        if (options?.playerId) {
            filtered = filtered.filter(l => l.playerId === options.playerId);
        }
        
        if (options?.startTime) {
            filtered = filtered.filter(l => l.timestamp >= options.startTime!);
        }
        
        if (options?.endTime) {
            filtered = filtered.filter(l => l.timestamp <= options.endTime!);
        }
        
        if (options?.limit) {
            filtered = filtered.slice(-options.limit);
        }
        
        return filtered;
    }
    
    // 获取最近日志
    public getRecentLogs(count: number = 100): LogEntry[] {
        return this.logs.slice(-count);
    }
    
    // 获取崩溃报告
    public getCrashReports(): CrashReport[] {
        return [...this.crashReports];
    }
    
    // 清空日志
    public clearLogs(): void {
        this.logs = [];
    }
    
    // 导出日志
    public exportLogs(): string {
        return JSON.stringify(this.logs, null, 2);
    }
    
    // 设置日志级别
    public setLogLevel(level: LogLevel): void {
        this.currentLogLevel = level;
    }
    
    // 性能计时
    public time(label: string): void {
        console.time(`[Perf] ${label}`);
    }
    
    public timeEnd(label: string): void {
        console.timeEnd(`[Perf] ${label}`);
    }
}

// 单例
export const logSystem = new LogSystem();
