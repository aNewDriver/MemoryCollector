/**
 * 任务与成就系统
 */

export enum TaskType {
    DAILY = 'daily',        // 每日任务
    WEEKLY = 'weekly',      // 每周任务
    MAIN = 'main',          // 主线任务
    ACHIEVEMENT = 'achievement'  // 成就
}

export enum TaskConditionType {
    // 战斗相关
    COMPLETE_LEVEL = 'complete_level',          // 通关指定关卡
    COMPLETE_CHAPTER = 'complete_chapter',      // 通关章节
    WIN_BATTLE_COUNT = 'win_battle_count',      // 胜利次数
    
    // 养成相关
    LEVEL_UP_CARD = 'level_up_card',            // 升级卡牌
    ASCEND_CARD = 'ascend_card',                // 突破卡牌
    AWAKEN_CARD = 'awaken_card',                // 觉醒卡牌
    EQUIP_CARD = 'equip_card',                  // 装备卡牌
    
    // 收集相关
    COLLECT_CARD = 'collect_card',              // 收集卡牌
    COLLECT_RARITY = 'collect_rarity',          // 收集指定稀有度卡牌
    GACHA_COUNT = 'gacha_count',                // 抽卡次数
    
    // 爬塔相关
    TOWER_FLOOR = 'tower_floor',                // 到达爬塔层数
    TOWER_CLEAR = 'tower_clear',                // 通关爬塔层
    
    // 社交相关
    ADD_FRIEND = 'add_friend',                  // 添加好友
    SEND_GIFT = 'send_gift',                    // 赠送礼物
    
    // 资源相关
    CONSUME_GOLD = 'consume_gold',              // 消耗金币
    CONSUME_CRYSTAL = 'consume_crystal',        // 消耗魂晶
    
    // 登录相关
    LOGIN_DAYS = 'login_days',                  // 累计登录天数
    LOGIN_STREAK = 'login_streak'               // 连续登录天数
}

export interface TaskCondition {
    type: TaskConditionType;
    targetId?: string;         // 目标ID（如关卡ID、卡牌ID）
    targetValue: number;       // 目标数值
    currentValue?: number;     // 当前进度
}

export interface TaskReward {
    type: 'gold' | 'soul_crystal' | 'friend_point' | 'material' | 'card' | 'equipment';
    itemId?: string;
    count: number;
}

export interface Task {
    id: string;
    type: TaskType;
    name: string;
    description: string;
    
    condition: TaskCondition;
    rewards: TaskReward[];
    
    // 前置任务（可选）
    prerequisiteTaskId?: string;
    
    // 等级限制（可选）
    requiredLevel?: number;
    
    // 状态
    isCompleted: boolean;
    isRewardClaimed: boolean;
}

export class TaskSystem {
    private tasks: Map<string, Task> = new Map();
    private dailyResetTime: number = 0;
    private weeklyResetTime: number = 0;
    
    constructor() {
        this.initTasks();
        this.calculateResetTimes();
    }
    
    private calculateResetTimes() {
        const now = new Date();
        
        // 每日重置时间：凌晨5点
        const dailyReset = new Date(now);
        dailyReset.setHours(5, 0, 0, 0);
        if (dailyReset <= now) {
            dailyReset.setDate(dailyReset.getDate() + 1);
        }
        this.dailyResetTime = dailyReset.getTime();
        
        // 每周重置时间：周一凌晨5点
        const weeklyReset = new Date(now);
        weeklyReset.setHours(5, 0, 0, 0);
        const daysUntilMonday = (1 - weeklyReset.getDay() + 7) % 7;
        weeklyReset.setDate(weeklyReset.getDate() + daysUntilMonday);
        if (weeklyReset <= now) {
            weeklyReset.setDate(weeklyReset.getDate() + 7);
        }
        this.weeklyResetTime = weeklyReset.getTime();
    }
    
    private initTasks() {
        // ============ 每日任务 ============
        const dailyTasks: Task[] = [
            {
                id: 'daily_login',
                type: TaskType.DAILY,
                name: '每日登录',
                description: '今日登录游戏',
                condition: { type: TaskConditionType.LOGIN_DAYS, targetValue: 1 },
                rewards: [{ type: 'gold', count: 5000 }, { type: 'friend_point', count: 100 }],
                isCompleted: false,
                isRewardClaimed: false
            },
            {
                id: 'daily_battle_3',
                type: TaskType.DAILY,
                name: '初出茅庐',
                description: '完成3次战斗',
                condition: { type: TaskConditionType.WIN_BATTLE_COUNT, targetValue: 3 },
                rewards: [{ type: 'gold', count: 3000 }],
                isCompleted: false,
                isRewardClaimed: false
            },
            {
                id: 'daily_battle_10',
                type: TaskType.DAILY,
                name: '战斗狂人',
                description: '完成10次战斗',
                condition: { type: TaskConditionType.WIN_BATTLE_COUNT, targetValue: 10 },
                rewards: [{ type: 'soul_crystal', count: 50 }],
                isCompleted: false,
                isRewardClaimed: false
            },
            {
                id: 'daily_tower',
                type: TaskType.DAILY,
                name: '勇攀高峰',
                description: '挑战爬塔3次',
                condition: { type: TaskConditionType.TOWER_CLEAR, targetValue: 3 },
                rewards: [{ type: 'gold', count: 5000 }, { type: 'material', itemId: 'tower_token', count: 10 }],
                isCompleted: false,
                isRewardClaimed: false
            },
            {
                id: 'daily_gacha',
                type: TaskType.DAILY,
                name: '记忆呼唤',
                description: '进行1次召唤',
                condition: { type: TaskConditionType.GACHA_COUNT, targetValue: 1 },
                rewards: [{ type: 'friend_point', count: 200 }],
                isCompleted: false,
                isRewardClaimed: false
            }
        ];
        
        // ============ 每周任务 ============
        const weeklyTasks: Task[] = [
            {
                id: 'weekly_battle_50',
                type: TaskType.WEEKLY,
                name: '周常战斗',
                description: '完成50次战斗',
                condition: { type: TaskConditionType.WIN_BATTLE_COUNT, targetValue: 50 },
                rewards: [{ type: 'soul_crystal', count: 300 }],
                isCompleted: false,
                isRewardClaimed: false
            },
            {
                id: 'weekly_level_up',
                type: TaskType.WEEKLY,
                name: '培养卡牌',
                description: '进行10次卡牌升级',
                condition: { type: TaskConditionType.LEVEL_UP_CARD, targetValue: 10 },
                rewards: [{ type: 'material', itemId: 'memory_dust_large', count: 5 }],
                isCompleted: false,
                isRewardClaimed: false
            },
            {
                id: 'weekly_tower_20',
                type: TaskType.WEEKLY,
                name: '爬塔高手',
                description: '爬塔前进20层',
                condition: { type: TaskConditionType.TOWER_CLEAR, targetValue: 20 },
                rewards: [{ type: 'soul_crystal', count: 500 }],
                isCompleted: false,
                isRewardClaimed: false
            }
        ];
        
        // ============ 主线任务 ============
        const mainTasks: Task[] = [
            {
                id: 'main_first_battle',
                type: TaskType.MAIN,
                name: '初次回收',
                description: '完成第一场战斗',
                condition: { type: TaskConditionType.WIN_BATTLE_COUNT, targetValue: 1 },
                rewards: [{ type: 'gold', count: 10000 }, { type: 'card', itemId: 'blacksmith_zhang', count: 1 }],
                isCompleted: false,
                isRewardClaimed: false
            },
            {
                id: 'main_chapter1_clear',
                type: TaskType.MAIN,
                name: '遗忘之城的记忆',
                description: '通关第一章',
                condition: { type: TaskConditionType.COMPLETE_CHAPTER, targetId: '1', targetValue: 1 },
                rewards: [{ type: 'soul_crystal', count: 1000 }, { type: 'card', itemId: 'jin_yu', count: 1 }],
                prerequisiteTaskId: 'main_first_battle',
                isCompleted: false,
                isRewardClaimed: false
            },
            {
                id: 'main_collect_10',
                type: TaskType.MAIN,
                name: '记忆的收集者',
                description: '收集10张不同的卡牌',
                condition: { type: TaskConditionType.COLLECT_CARD, targetValue: 10 },
                rewards: [{ type: 'soul_crystal', count: 500 }],
                isCompleted: false,
                isRewardClaimed: false
            }
        ];
        
        // ============ 成就 ============
        const achievements: Task[] = [
            // 收集类
            {
                id: 'ach_collect_10',
                type: TaskType.ACHIEVEMENT,
                name: '初识记忆',
                description: '累计收集10张卡牌',
                condition: { type: TaskConditionType.COLLECT_CARD, targetValue: 10 },
                rewards: [{ type: 'soul_crystal', count: 100 }],
                isCompleted: false,
                isRewardClaimed: false
            },
            {
                id: 'ach_collect_30',
                type: TaskType.ACHIEVEMENT,
                name: '记忆的回响',
                description: '累计收集30张卡牌',
                condition: { type: TaskConditionType.COLLECT_CARD, targetValue: 30 },
                rewards: [{ type: 'soul_crystal', count: 300 }],
                isCompleted: false,
                isRewardClaimed: false
            },
            {
                id: 'ach_collect_50',
                type: TaskType.ACHIEVEMENT,
                name: '记忆大师',
                description: '累计收集50张卡牌',
                condition: { type: TaskConditionType.COLLECT_CARD, targetValue: 50 },
                rewards: [{ type: 'soul_crystal', count: 1000 }],
                isCompleted: false,
                isRewardClaimed: false
            },
            
            // 稀有度收集
            {
                id: 'ach_collect_epic',
                type: TaskType.ACHIEVEMENT,
                name: '史诗之旅',
                description: '收集5张史诗卡牌',
                condition: { type: TaskConditionType.COLLECT_RARITY, targetId: '3', targetValue: 5 },
                rewards: [{ type: 'soul_crystal', count: 500 }],
                isCompleted: false,
                isRewardClaimed: false
            },
            
            // 战斗类
            {
                id: 'ach_battle_100',
                type: TaskType.ACHIEVEMENT,
                name: '百战老兵',
                description: '累计获胜100场战斗',
                condition: { type: TaskConditionType.WIN_BATTLE_COUNT, targetValue: 100 },
                rewards: [{ type: 'gold', count: 50000 }],
                isCompleted: false,
                isRewardClaimed: false
            },
            
            // 爬塔类
            {
                id: 'ach_tower_50',
                type: TaskType.ACHIEVEMENT,
                name: '登高望远',
                description: '到达爬塔第50层',
                condition: { type: TaskConditionType.TOWER_FLOOR, targetValue: 50 },
                rewards: [{ type: 'soul_crystal', count: 500 }],
                isCompleted: false,
                isRewardClaimed: false
            },
            {
                id: 'ach_tower_100',
                type: TaskType.ACHIEVEMENT,
                name: '登峰造极',
                description: '到达爬塔第100层',
                condition: { type: TaskConditionType.TOWER_FLOOR, targetValue: 100 },
                rewards: [{ type: 'card', itemId: 'random_legend', count: 1 }],
                isCompleted: false,
                isRewardClaimed: false
            },
            
            // 养成类
            {
                id: 'ach_awaken_first',
                type: TaskType.ACHIEVEMENT,
                name: '觉醒时刻',
                description: '首次觉醒卡牌',
                condition: { type: TaskConditionType.AWAKEN_CARD, targetValue: 1 },
                rewards: [{ type: 'soul_crystal', count: 1000 }],
                isCompleted: false,
                isRewardClaimed: false
            },
            
            // 登录类
            {
                id: 'ach_login_7',
                type: TaskType.ACHIEVEMENT,
                name: '初来乍到',
                description: '累计登录7天',
                condition: { type: TaskConditionType.LOGIN_DAYS, targetValue: 7 },
                rewards: [{ type: 'card', itemId: 'qing_yi', count: 1 }],
                isCompleted: false,
                isRewardClaimed: false
            },
            {
                id: 'ach_login_30',
                type: TaskType.ACHIEVEMENT,
                name: '常驻回收者',
                description: '累计登录30天',
                condition: { type: TaskConditionType.LOGIN_DAYS, targetValue: 30 },
                rewards: [{ type: 'soul_crystal', count: 3000 }],
                isCompleted: false,
                isRewardClaimed: false
            }
        ];
        
        // 注册所有任务
        [...dailyTasks, ...weeklyTasks, ...mainTasks, ...achievements].forEach(task => {
            this.tasks.set(task.id, task);
        });
    }
    
    // 更新任务进度
    public updateProgress(type: TaskConditionType, value: number = 1, targetId?: string) {
        this.tasks.forEach(task => {
            if (task.isCompleted || task.isRewardClaimed) return;
            
            // 检查前置任务
            if (task.prerequisiteTaskId) {
                const preTask = this.tasks.get(task.prerequisiteTaskId);
                if (!preTask?.isCompleted) return;
            }
            
            // 检查条件匹配
            const condition = task.condition;
            if (condition.type !== type) return;
            if (targetId && condition.targetId && condition.targetId !== targetId) return;
            
            // 更新进度
            condition.currentValue = (condition.currentValue || 0) + value;
            
            // 检查完成
            if (condition.currentValue >= condition.targetValue) {
                task.isCompleted = true;
                this.onTaskComplete(task);
            }
        });
    }
    
    private onTaskComplete(task: Task) {
        console.log(`任务完成: ${task.name}`);
        // TODO: 显示完成提示
    }
    
    // 领取奖励
    public claimReward(taskId: string): { success: boolean; rewards?: TaskReward[]; error?: string } {
        const task = this.tasks.get(taskId);
        if (!task) return { success: false, error: '任务不存在' };
        if (!task.isCompleted) return { success: false, error: '任务未完成' };
        if (task.isRewardClaimed) return { success: false, error: '奖励已领取' };
        
        task.isRewardClaimed = true;
        return { success: true, rewards: task.rewards };
    }
    
    // 获取任务列表
    public getTasks(type: TaskType): Task[] {
        return Array.from(this.tasks.values()).filter(task => task.type === type);
    }
    
    // 获取每日任务
    public getDailyTasks(): Task[] {
        return this.getTasks(TaskType.DAILY);
    }
    
    // 获取每周任务
    public getWeeklyTasks(): Task[] {
        return this.getTasks(TaskType.WEEKLY);
    }
    
    // 获取主线任务
    public getMainTasks(): Task[] {
        return this.getTasks(TaskType.MAIN);
    }
    
    // 获取成就
    public getAchievements(): Task[] {
        return this.getTasks(TaskType.ACHIEVEMENT);
    }
    
    // 重置每日任务
    public resetDailyTasks() {
        this.tasks.forEach(task => {
            if (task.type === TaskType.DAILY) {
                task.condition.currentValue = 0;
                task.isCompleted = false;
                task.isRewardClaimed = false;
            }
        });
        this.calculateResetTimes();
    }
    
    // 重置每周任务
    public resetWeeklyTasks() {
        this.tasks.forEach(task => {
            if (task.type === TaskType.WEEKLY) {
                task.condition.currentValue = 0;
                task.isCompleted = false;
                task.isRewardClaimed = false;
            }
        });
        this.calculateResetTimes();
    }
    
    // 获取下次重置时间
    public getNextResetTime(type: 'daily' | 'weekly'): number {
        return type === 'daily' ? this.dailyResetTime : this.weeklyResetTime;
    }
    
    // 获取可领取奖励的任务数量
    public getClaimableCount(): number {
        return Array.from(this.tasks.values()).filter(
            task => task.isCompleted && !task.isRewardClaimed
        ).length;
    }
}

// 单例
export const taskSystem = new TaskSystem();
