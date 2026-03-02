/**
 * 游戏配置管理系统
 * 数值配置、平衡调整、热更新支持
 */

export interface GameConfig {
    version: string;
    lastUpdate: number;
    
    // 战斗配置
    battle: {
        maxTurns: number;           // 最大回合数
        energyPerTurn: number;      // 每回合恢复能量
        critMultiplier: number;     // 暴击倍率基础
        elementAdvantage: number;   // 元素克制加成
        defenseFormula: string;     // 防御公式
    };
    
    // 养成配置
    growth: {
        maxLevel: number;
        maxAscension: number;
        expCurve: number;           // 经验曲线指数
        ascensionCostMultiplier: number;
    };
    
    // 经济配置
    economy: {
        goldDropBase: number;
        goldDropMultiplier: number;
        crystalRegenRate: number;   // 魂晶恢复速度
        dailyGoldLimit: number;
        dailyCrystalLimit: number;
    };
    
    // 抽卡配置
    gacha: {
        standardRates: {
            [rarity: number]: number;  // 稀有度概率
        };
        pityThreshold: number;         // 保底阈值
        softPityStart: number;         // 软保底开始
        costPerPull: number;
    };
    
    // 功能解锁等级
    unlockLevels: {
        arena: number;
        guild: number;
        tower: number;
        dungeon: number;
        trial: number;
    };
    
    // 限时活动配置
    events: {
        autoStart: boolean;
        defaultDuration: number;      // 默认活动时长（天）
        maxConcurrent: number;        // 最大同时进行活动数
    };
}

// 默认配置
export const DEFAULT_CONFIG: GameConfig = {
    version: '1.0.0',
    lastUpdate: Date.now(),
    
    battle: {
        maxTurns: 50,
        energyPerTurn: 20,
        critMultiplier: 1.5,
        elementAdvantage: 0.3,
        defenseFormula: 'def / (def + 200)'
    },
    
    growth: {
        maxLevel: 100,
        maxAscension: 5,
        expCurve: 1.05,
        ascensionCostMultiplier: 1.5
    },
    
    economy: {
        goldDropBase: 100,
        goldDropMultiplier: 1.02,
        crystalRegenRate: 0,
        dailyGoldLimit: 1000000,
        dailyCrystalLimit: 99999
    },
    
    gacha: {
        standardRates: {
            1: 50,   // 绿色 50%
            2: 30,   // 蓝色 30%
            3: 12,   // 紫色 12%
            4: 6,    // 金色 6%
            5: 2     // 红色 2%
        },
        pityThreshold: 30,
        softPityStart: 25,
        costPerPull: 300
    },
    
    unlockLevels: {
        arena: 15,
        guild: 20,
        tower: 10,
        dungeon: 12,
        trial: 25
    },
    
    events: {
        autoStart: true,
        defaultDuration: 7,
        maxConcurrent: 5
    }
};

export class ConfigManager {
    private config: GameConfig = { ...DEFAULT_CONFIG };
    private listeners: Map<string, Function[]> = new Map();
    
    // 初始化配置
    public init(config?: Partial<GameConfig>): void {
        if (config) {
            this.config = this.mergeConfig(DEFAULT_CONFIG, config);
        }
        console.log('[Config] Initialized with version:', this.config.version);
    }
    
    // 合并配置
    private mergeConfig(base: GameConfig, override: Partial<GameConfig>): GameConfig {
        return {
            ...base,
            ...override,
            battle: { ...base.battle, ...override.battle },
            growth: { ...base.growth, ...override.growth },
            economy: { ...base.economy, ...override.economy },
            gacha: { ...base.gacha, ...override.gacha },
            unlockLevels: { ...base.unlockLevels, ...override.unlockLevels },
            events: { ...base.events, ...override.events }
        };
    }
    
    // 获取配置
    public getConfig(): GameConfig {
        return { ...this.config };
    }
    
    // 获取特定配置项
    public get<K extends keyof GameConfig>(key: K): GameConfig[K] {
        return this.config[key];
    }
    
    // 更新配置（热更新）
    public updateConfig(updates: Partial<GameConfig>): void {
        const oldConfig = { ...this.config };
        this.config = this.mergeConfig(this.config, updates);
        this.config.lastUpdate = Date.now();
        
        // 触发变更通知
        this.notifyChange(oldConfig, this.config);
        
        console.log('[Config] Updated to version:', this.config.version);
    }
    
    // 监听配置变更
    public onChange(callback: (oldConfig: GameConfig, newConfig: GameConfig) => void): () => void {
        if (!this.listeners.has('change')) {
            this.listeners.set('change', []);
        }
        this.listeners.get('change')!.push(callback);
        
        // 返回取消订阅函数
        return () => {
            const callbacks = this.listeners.get('change');
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) callbacks.splice(index, 1);
            }
        };
    }
    
    private notifyChange(oldConfig: GameConfig, newConfig: GameConfig): void {
        const callbacks = this.listeners.get('change');
        if (callbacks) {
            callbacks.forEach(cb => {
                try {
                    cb(oldConfig, newConfig);
                } catch (e) {
                    console.error('[Config] Error in change listener:', e);
                }
            });
        }
    }
    
    // 从服务器获取最新配置
    public async fetchRemoteConfig(url: string): Promise<boolean> {
        try {
            // TODO: 实际网络请求
            // const response = await fetch(url);
            // const remoteConfig = await response.json();
            // this.updateConfig(remoteConfig);
            
            console.log('[Config] Would fetch from:', url);
            return true;
        } catch (e) {
            console.error('[Config] Failed to fetch remote config:', e);
            return false;
        }
    }
    
    // 导出配置（用于备份或分享）
    public exportConfig(): string {
        return JSON.stringify(this.config, null, 2);
    }
    
    // 导入配置
    public importConfig(json: string): boolean {
        try {
            const parsed = JSON.parse(json);
            this.updateConfig(parsed);
            return true;
        } catch (e) {
            console.error('[Config] Failed to import config:', e);
            return false;
        }
    }
    
    // 检查功能是否解锁
    public isFeatureUnlocked(feature: keyof GameConfig['unlockLevels'], playerLevel: number): boolean {
        return playerLevel >= this.config.unlockLevels[feature];
    }
    
    // 获取解锁等级
    public getUnlockLevel(feature: keyof GameConfig['unlockLevels']): number {
        return this.config.unlockLevels[feature];
    }
    
    // 计算升级所需经验
    public calculateExpForLevel(level: number): number {
        return Math.floor(100 * Math.pow(this.config.growth.expCurve, level));
    }
    
    // 计算金币掉落
    public calculateGoldDrop(baseLevel: number, difficulty: number): number {
        return Math.floor(
            this.config.economy.goldDropBase * 
            Math.pow(this.config.economy.goldDropMultiplier, baseLevel) * 
            difficulty
        );
    }
    
    // 获取抽卡概率
    public getGachaRate(rarity: number): number {
        return this.config.gacha.standardRates[rarity] || 0;
    }
    
    // 重置为默认配置
    public resetToDefault(): void {
        this.updateConfig(DEFAULT_CONFIG);
    }
}

// 单例
export const configManager = new ConfigManager();
