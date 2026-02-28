/**
 * 存档管理器
 * 处理游戏数据的本地存储和云同步
 */

import { PlayerData, GameSettings } from '../data/PlayerData';
import { CardInstance } from '../data/CardData';

export interface GameSaveData {
    version: string;
    timestamp: number;
    
    // 玩家数据
    playerData: PlayerData;
    
    // 卡牌数据
    ownedCards: CardInstance[];
    
    // 背包数据
    inventory: { id: string; configId: string; type: string; count: number }[];
    
    // 游戏进度
    unlockedChapters: number[];
    completedLevels: { chapterId: number; levelNumber: number; stars: number }[];
    
    // 爬塔进度
    towerHighestFloor: number;
    
    // 抽卡记录
    gachaHistory: any[];
    
    // 任务进度
    taskProgress: { taskId: string; currentValue: number; isCompleted: boolean; isRewardClaimed: boolean }[];
    
    // 统计数据
    statistics: GameStatistics;
}

export interface GameStatistics {
    totalBattles: number;
    totalWins: number;
    totalGachaCount: number;
    playTime: number;  // 游戏时长（秒）
    loginDays: number;
    lastLoginDate: string;
}

export class SaveManager {
    private static readonly SAVE_KEY = 'memory_collector_save_v1';
    private static readonly BACKUP_KEY_PREFIX = 'memory_collector_backup_';
    private static readonly MAX_BACKUPS = 5;
    
    private currentSave: GameSaveData | null = null;
    private autoSaveInterval: number = 300000;  // 5分钟自动保存
    private autoSaveTimer: any = null;
    private playTimeStart: number = 0;
    
    // 是否使用云存档
    private useCloudSave: boolean = false;
    private cloudSaveUrl: string = '';
    
    constructor() {
        this.playTimeStart = Date.now();
    }
    
    // ============ 本地存档 ============
    
    // 保存游戏
    public save(playerData: PlayerData, cards: CardInstance[], inventory: any[]): boolean {
        try {
            const saveData: GameSaveData = {
                version: '1.0.0',
                timestamp: Date.now(),
                playerData,
                ownedCards: cards,
                inventory,
                unlockedChapters: this.getUnlockedChapters(),
                completedLevels: this.getCompletedLevels(),
                towerHighestFloor: playerData.highestTowerFloor,
                gachaHistory: [],  // 从gachaSystem获取
                taskProgress: [],  // 从taskSystem获取
                statistics: this.getStatistics()
            };
            
            // 序列化并存储
            const saveString = JSON.stringify(saveData);
            localStorage.setItem(SaveManager.SAVE_KEY, saveString);
            
            // 创建备份
            this.createBackup(saveString);
            
            this.currentSave = saveData;
            console.log('Game saved successfully');
            return true;
            
        } catch (error) {
            console.error('Save failed:', error);
            return false;
        }
    }
    
    // 加载游戏
    public load(): GameSaveData | null {
        try {
            const saveString = localStorage.getItem(SaveManager.SAVE_KEY);
            if (!saveString) {
                console.log('No save data found');
                return null;
            }
            
            const saveData: GameSaveData = JSON.parse(saveString);
            
            // 验证存档版本
            if (!this.validateSaveVersion(saveData.version)) {
                console.warn('Save version mismatch, attempting migration');
                return this.migrateSaveData(saveData);
            }
            
            this.currentSave = saveData;
            console.log('Game loaded successfully');
            
            // 更新游戏时长统计
            this.updatePlayTime();
            
            return saveData;
            
        } catch (error) {
            console.error('Load failed:', error);
            
            // 尝试从备份恢复
            return this.restoreFromBackup();
        }
    }
    
    // 检查是否有存档
    public hasSave(): boolean {
        return localStorage.getItem(SaveManager.SAVE_KEY) !== null;
    }
    
    // 删除存档
    public deleteSave(): boolean {
        try {
            localStorage.removeItem(SaveManager.SAVE_KEY);
            this.currentSave = null;
            
            // 清除备份
            for (let i = 0; i < SaveManager.MAX_BACKUPS; i++) {
                localStorage.removeItem(`${SaveManager.BACKUP_KEY_PREFIX}${i}`);
            }
            
            console.log('Save deleted');
            return true;
        } catch (error) {
            console.error('Delete save failed:', error);
            return false;
        }
    }
    
    // ============ 自动保存 ============
    
    public startAutoSave(saveCallback: () => void): void {
        this.stopAutoSave();
        
        this.autoSaveTimer = setInterval(() => {
            saveCallback();
        }, this.autoSaveInterval);
        
        console.log('Auto save started');
    }
    
    public stopAutoSave(): void {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
            console.log('Auto save stopped');
        }
    }
    
    // ============ 备份系统 ============
    
    private createBackup(saveString: string): void {
        try {
            // 轮换备份
            for (let i = SaveManager.MAX_BACKUPS - 1; i > 0; i--) {
                const prevBackup = localStorage.getItem(`${SaveManager.BACKUP_KEY_PREFIX}${i - 1}`);
                if (prevBackup) {
                    localStorage.setItem(`${SaveManager.BACKUP_KEY_PREFIX}${i}`, prevBackup);
                }
            }
            
            // 保存最新备份
            localStorage.setItem(`${SaveManager.BACKUP_KEY_PREFIX}0`, saveString);
            
        } catch (error) {
            console.warn('Backup creation failed:', error);
        }
    }
    
    private restoreFromBackup(): GameSaveData | null {
        try {
            for (let i = 0; i < SaveManager.MAX_BACKUPS; i++) {
                const backup = localStorage.getItem(`${SaveManager.BACKUP_KEY_PREFIX}${i}`);
                if (backup) {
                    console.log(`Restoring from backup ${i}`);
                    return JSON.parse(backup);
                }
            }
            return null;
        } catch (error) {
            console.error('Restore from backup failed:', error);
            return null;
        }
    }
    
    // ============ 云存档 ============
    
    public async syncToCloud(): Promise<boolean> {
        if (!this.useCloudSave || !this.currentSave) return false;
        
        try {
            // TODO: 实现云存档上传
            // const response = await fetch(this.cloudSaveUrl + '/upload', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(this.currentSave)
            // });
            // return response.ok;
            
            console.log('Sync to cloud (placeholder)');
            return true;
        } catch (error) {
            console.error('Cloud sync failed:', error);
            return false;
        }
    }
    
    public async syncFromCloud(): Promise<GameSaveData | null> {
        if (!this.useCloudSave) return null;
        
        try {
            // TODO: 实现云存档下载
            // const response = await fetch(this.cloudSaveUrl + '/download');
            // if (response.ok) {
            //     const cloudSave = await response.json();
            //     return cloudSave;
            // }
            
            console.log('Sync from cloud (placeholder)');
            return null;
        } catch (error) {
            console.error('Cloud sync failed:', error);
            return null;
        }
    }
    
    // ============ 存档验证与迁移 ============
    
    private validateSaveVersion(version: string): boolean {
        const currentVersion = '1.0.0';
        return version === currentVersion;
    }
    
    private migrateSaveData(oldData: GameSaveData): GameSaveData {
        // 处理存档版本迁移
        // 这里可以根据需要实现不同版本之间的数据转换
        
        const migratedData: GameSaveData = {
            ...oldData,
            version: '1.0.0'
        };
        
        return migratedData;
    }
    
    // ============ 统计 ============
    
    private getStatistics(): GameStatistics {
        const today = new Date().toDateString();
        const savedStats = this.currentSave?.statistics;
        
        let loginDays = savedStats?.loginDays || 0;
        let lastLoginDate = savedStats?.lastLoginDate || '';
        
        // 检查是否是新的一天登录
        if (lastLoginDate !== today) {
            loginDays++;
            lastLoginDate = today;
        }
        
        return {
            totalBattles: savedStats?.totalBattles || 0,
            totalWins: savedStats?.totalWins || 0,
            totalGachaCount: savedStats?.totalGachaCount || 0,
            playTime: (savedStats?.playTime || 0) + this.getSessionPlayTime(),
            loginDays,
            lastLoginDate
        };
    }
    
    private getSessionPlayTime(): number {
        return Math.floor((Date.now() - this.playTimeStart) / 1000);
    }
    
    private updatePlayTime(): void {
        // 更新当前会话的游戏时长
    }
    
    // ============ 辅助方法 ============
    
    private getUnlockedChapters(): number[] {
        // TODO: 从章节管理器获取
        return [1];
    }
    
    private getCompletedLevels(): { chapterId: number; levelNumber: number; stars: number }[] {
        // TODO: 从关卡管理器获取
        return [];
    }
    
    // 导出存档（用于备份或分享）
    public exportSave(): string | null {
        if (!this.currentSave) return null;
        return btoa(JSON.stringify(this.currentSave));
    }
    
    // 导入存档
    public importSave(saveString: string): boolean {
        try {
            const decoded = atob(saveString);
            const saveData: GameSaveData = JSON.parse(decoded);
            
            if (this.validateSaveData(saveData)) {
                localStorage.setItem(SaveManager.SAVE_KEY, decoded);
                this.currentSave = saveData;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Import save failed:', error);
            return false;
        }
    }
    
    private validateSaveData(data: any): boolean {
        // 基本验证
        return data && 
               data.version && 
               data.playerData && 
               data.timestamp;
    }
}

// 单例
export const saveManager = new SaveManager();
