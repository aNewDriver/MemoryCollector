/**
 * 签到系统
 * 每日签到奖励，累积签到奖励
 */

export interface DailyCheckInReward {
    day: number;
    reward: {
        gold?: number;
        soulCrystal?: number;
        itemId?: string;
        itemCount?: number;
        specialReward?: string;  // 特殊奖励如角色、皮肤等
    };
    isSpecial?: boolean;  // 是否为特殊奖励（第7天、第30天等）
}

export interface MonthlyCheckIn {
    month: number;
    year: number;
    rewards: DailyCheckInReward[];
    totalDays: number;
}

export interface CheckInRecord {
    date: string;  // YYYY-MM-DD
    dayOfMonth: number;
    claimed: boolean;
}

// 签到奖励配置（每月循环）
export const CHECK_IN_REWARDS: DailyCheckInReward[] = [
    // 第1周
    { day: 1, reward: { gold: 1000 } },
    { day: 2, reward: { gold: 1500 } },
    { day: 3, reward: { gold: 2000 } },
    { day: 4, reward: { gold: 2500 } },
    { day: 5, reward: { gold: 3000 } },
    { day: 6, reward: { gold: 3500 } },
    { day: 7, reward: { gold: 5000, soulCrystal: 100 }, isSpecial: true },  // 周奖励
    
    // 第2周
    { day: 8, reward: { gold: 2000 } },
    { day: 9, reward: { gold: 2000, itemId: 'memory_dust', itemCount: 5 } },
    { day: 10, reward: { gold: 2500 } },
    { day: 11, reward: { gold: 2500, itemId: 'memory_dust', itemCount: 5 } },
    { day: 12, reward: { gold: 3000 } },
    { day: 13, reward: { gold: 3000, itemId: 'memory_dust', itemCount: 10 } },
    { day: 14, reward: { gold: 6000, soulCrystal: 200 }, isSpecial: true },  // 周奖励
    
    // 第3周
    { day: 15, reward: { gold: 3000 } },
    { day: 16, reward: { gold: 3000, itemId: 'ascension_stone', itemCount: 3 } },
    { day: 17, reward: { gold: 3500 } },
    { day: 18, reward: { gold: 3500, itemId: 'ascension_stone', itemCount: 3 } },
    { day: 19, reward: { gold: 4000 } },
    { day: 20, reward: { gold: 4000, itemId: 'ascension_stone', itemCount: 5 } },
    { day: 21, reward: { gold: 7000, soulCrystal: 300, itemId: 'gacha_ticket', itemCount: 1 }, isSpecial: true },  // 周奖励
    
    // 第4周
    { day: 22, reward: { gold: 4000 } },
    { day: 23, reward: { gold: 4000, soulCrystal: 100 } },
    { day: 24, reward: { gold: 4500 } },
    { day: 25, reward: { gold: 4500, soulCrystal: 100 } },
    { day: 26, reward: { gold: 5000 } },
    { day: 27, reward: { gold: 5000, soulCrystal: 150 } },
    { day: 28, reward: { gold: 10000, soulCrystal: 500, itemId: 'gacha_ticket', itemCount: 3 }, isSpecial: true },  // 月奖励
    
    // 第29-31天（根据月份可能不存在）
    { day: 29, reward: { gold: 3000, soulCrystal: 100 } },
    { day: 30, reward: { gold: 3000, soulCrystal: 150 } },
    { day: 31, reward: { gold: 5000, soulCrystal: 200 } }
];

// 累积签到奖励
export const CUMULATIVE_REWARDS: { days: number; reward: any }[] = [
    { days: 7, reward: { soulCrystal: 500, itemId: 'rare_card_box', itemCount: 1 } },
    { days: 15, reward: { soulCrystal: 1000, itemId: 'epic_card_box', itemCount: 1 } },
    { days: 30, reward: { soulCrystal: 2000, specialCard: 'random_epic' } },
    { days: 60, reward: { soulCrystal: 3000, specialCard: 'random_legend' } },
    { days: 100, reward: { soulCrystal: 5000, title: '忠实玩家', exclusiveFrame: 'loyalty_frame' } }
];

export class CheckInSystem {
    private checkInRecords: Map<string, CheckInRecord> = new Map();  // date -> record
    private consecutiveDays: number = 0;
    private totalCheckIns: number = 0;
    private lastCheckInDate: string = '';
    private cumulativeRewardsClaimed: Set<number> = new Set();
    
    // 获取今日签到状态
    public getTodayStatus(): {
        canCheckIn: boolean;
        todayReward?: DailyCheckInReward;
        consecutiveDays: number;
        totalCheckIns: number;
    } {
        const today = this.getTodayString();
        const todayRecord = this.checkInRecords.get(today);
        const dayOfMonth = new Date().getDate();
        
        return {
            canCheckIn: !todayRecord?.claimed,
            todayReward: CHECK_IN_REWARDS.find(r => r.day === dayOfMonth),
            consecutiveDays: this.consecutiveDays,
            totalCheckIns: this.totalCheckIns
        };
    }
    
    // 执行签到
    public checkIn(): { 
        success: boolean; 
        reward?: any; 
        cumulativeReward?: any;
        error?: string;
    } {
        const today = this.getTodayString();
        const todayRecord = this.checkInRecords.get(today);
        
        if (todayRecord?.claimed) {
            return { success: false, error: '今日已签到' };
        }
        
        // 更新连续签到天数
        if (this.isYesterday(this.lastCheckInDate)) {
            this.consecutiveDays++;
        } else if (this.lastCheckInDate !== today) {
            this.consecutiveDays = 1;  // 断签重置
        }
        
        // 记录签到
        const dayOfMonth = new Date().getDate();
        this.checkInRecords.set(today, {
            date: today,
            dayOfMonth,
            claimed: true
        });
        
        this.lastCheckInDate = today;
        this.totalCheckIns++;
        
        // 获取今日奖励
        const reward = CHECK_IN_REWARDS.find(r => r.day === dayOfMonth);
        
        // 检查累积奖励
        let cumulativeReward = null;
        for (const cumReward of CUMULATIVE_REWARDS) {
            if (this.totalCheckIns >= cumReward.days && 
                !this.cumulativeRewardsClaimed.has(cumReward.days)) {
                cumulativeReward = cumReward.reward;
                this.cumulativeRewardsClaimed.add(cumReward.days);
                break;  // 一次只领取一个累积奖励
            }
        }
        
        return {
            success: true,
            reward: reward?.reward,
            cumulativeReward
        };
    }
    
    // 获取本月签到日历
    public getMonthlyCalendar(): {
        day: number;
        claimed: boolean;
        canClaim: boolean;
        reward: any;
    }[] {
        const today = new Date();
        const currentDay = today.getDate();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        
        const calendar = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = this.getDateString(today.getFullYear(), today.getMonth(), day);
            const record = this.checkInRecords.get(dateStr);
            
            calendar.push({
                day,
                claimed: !!record?.claimed,
                canClaim: day === currentDay && !record?.claimed,
                reward: CHECK_IN_REWARDS.find(r => r.day === day)?.reward
            });
        }
        
        return calendar;
    }
    
    // 获取累积签到奖励列表
    public getCumulativeRewards(): {
        days: number;
        reward: any;
        claimed: boolean;
        canClaim: boolean;
    }[] {
        return CUMULATIVE_REWARDS.map(cr => ({
            days: cr.days,
            reward: cr.reward,
            claimed: this.cumulativeRewardsClaimed.has(cr.days),
            canClaim: this.totalCheckIns >= cr.days && !this.cumulativeRewardsClaimed.has(cr.days)
        }));
    }
    
    // 领取累积奖励
    public claimCumulativeReward(days: number): { success: boolean; reward?: any; error?: string } {
        const cumReward = CUMULATIVE_REWARDS.find(cr => cr.days === days);
        if (!cumReward) {
            return { success: false, error: '奖励不存在' };
        }
        
        if (this.totalCheckIns < days) {
            return { success: false, error: '签到天数不足' };
        }
        
        if (this.cumulativeRewardsClaimed.has(days)) {
            return { success: false, error: '奖励已领取' };
        }
        
        this.cumulativeRewardsClaimed.add(days);
        return { success: true, reward: cumReward.reward };
    }
    
    // 补签（消耗资源）
    public makeUpCheckIn(date: string, cost: number): { success: boolean; error?: string } {
        if (this.checkInRecords.has(date)) {
            return { success: false, error: '该日已签到' };
        }
        
        // TODO: 检查并扣除资源
        
        const dateObj = new Date(date);
        this.checkInRecords.set(date, {
            date,
            dayOfMonth: dateObj.getDate(),
            claimed: true
        });
        
        this.totalCheckIns++;
        
        return { success: true };
    }
    
    // 获取连续签到天数
    public getConsecutiveDays(): number {
        return this.consecutiveDays;
    }
    
    // 获取总签到天数
    public getTotalCheckIns(): number {
        return this.totalCheckIns;
    }
    
    // 工具方法
    private getTodayString(): string {
        const now = new Date();
        return this.getDateString(now.getFullYear(), now.getMonth(), now.getDate());
    }
    
    private getDateString(year: number, month: number, day: number): string {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    
    private isYesterday(dateStr: string): boolean {
        if (!dateStr) return false;
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = this.getDateString(
            yesterday.getFullYear(),
            yesterday.getMonth(),
            yesterday.getDate()
        );
        
        return dateStr === yesterdayStr;
    }
    
    // 每月重置（保留累积数据）
    public monthlyReset(): void {
        this.checkInRecords.clear();
        this.consecutiveDays = 0;
    }
}

// 单例
export const checkInSystem = new CheckInSystem();
