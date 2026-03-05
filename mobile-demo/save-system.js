/**
 * 存档系统
 * 支持本地存档(localStorage)和云存档
 */

const SAVE_KEY = 'memory_collector_save';
const SAVE_VERSION = '0.4';

// 存档数据结构
interface SaveData {
    version: string;
    timestamp: number;
    player: PlayerData;
    collection: CardSaveData[];
    progress: ProgressData;
    settings: SettingsData;
}

interface PlayerData {
    gold: number;
    diamond: number;
    expCards: number;
    level: number;
    exp: number;
}

interface CardSaveData {
    id: string;
    level: number;
    star: number;
    exp: number;
}

interface ProgressData {
    chapter: number;
    scene: string;
    completedScenes: string[];
    collectedMemories: string[];
}

interface SettingsData {
    bgmVolume: number;
    sfxVolume: number;
    language: string;
}

// 存档管理器
class SaveManager {
    private autoSaveInterval: number = 60000; // 60秒自动保存
    private autoSaveTimer: number | null = null;

    // 初始化
    public init(): void {
        this.load();
        this.startAutoSave();
    }

    // 创建新存档
    public createNewSave(): SaveData {
        return {
            version: SAVE_VERSION,
            timestamp: Date.now(),
            player: {
                gold: 5000,
                diamond: 50,
                expCards: 20,
                level: 1,
                exp: 0
            },
            collection: [],
            progress: {
                chapter: 1,
                scene: 'entrance',
                completedScenes: [],
                collectedMemories: []
            },
            settings: {
                bgmVolume: 0.7,
                sfxVolume: 1.0,
                language: 'zh-CN'
            }
        };
    }

    // 保存到本地
    public save(data: SaveData): boolean {
        try {
            data.timestamp = Date.now();
            const saveString = JSON.stringify(data);
            localStorage.setItem(SAVE_KEY, saveString);
            console.log('[SaveManager] 存档成功', new Date().toLocaleString());
            return true;
        } catch (e) {
            console.error('[SaveManager] 存档失败:', e);
            return false;
        }
    }

    // 从本地加载
    public load(): SaveData | null {
        try {
            const saveString = localStorage.getItem(SAVE_KEY);
            if (!saveString) {
                console.log('[SaveManager] 没有找到存档，创建新存档');
                return this.createNewSave();
            }

            const data: SaveData = JSON.parse(saveString);
            
            // 版本检查
            if (data.version !== SAVE_VERSION) {
                console.log('[SaveManager] 存档版本过期，尝试迁移');
                return this.migrateSave(data);
            }

            console.log('[SaveManager] 读档成功', new Date(data.timestamp).toLocaleString());
            return data;
        } catch (e) {
            console.error('[SaveManager] 读档失败:', e);
            return this.createNewSave();
        }
    }

    // 存档迁移（版本更新时）
    private migrateSave(oldData: any): SaveData {
        const newData = this.createNewSave();
        
        // 保留玩家数据
        if (oldData.player) {
            newData.player = { ...newData.player, ...oldData.player };
        }
        
        // 保留卡牌收藏
        if (oldData.collection) {
            newData.collection = oldData.collection;
        }
        
        // 保留进度
        if (oldData.progress) {
            newData.progress = { ...newData.progress, ...oldData.progress };
        }
        
        // 保留设置
        if (oldData.settings) {
            newData.settings = { ...newData.settings, ...oldData.settings };
        }

        console.log('[SaveManager] 存档迁移完成');
        this.save(newData);
        return newData;
    }

    // 删除存档
    public delete(): boolean {
        try {
            localStorage.removeItem(SAVE_KEY);
            console.log('[SaveManager] 存档已删除');
            return true;
        } catch (e) {
            console.error('[SaveManager] 删除存档失败:', e);
            return false;
        }
    }

    // 导出存档（用于云存档或分享）
    public export(): string {
        const data = this.load();
        if (!data) return '';
        return btoa(JSON.stringify(data)); // Base64编码
    }

    // 导入存档
    public import(base64Data: string): boolean {
        try {
            const jsonString = atob(base64Data);
            const data: SaveData = JSON.parse(jsonString);
            return this.save(data);
        } catch (e) {
            console.error('[SaveManager] 导入存档失败:', e);
            return false;
        }
    }

    // 开始自动保存
    public startAutoSave(): void {
        if (this.autoSaveTimer) return;
        
        this.autoSaveTimer = window.setInterval(() => {
            const currentData = this.load();
            if (currentData) {
                this.save(currentData);
            }
        }, this.autoSaveInterval);
        
        console.log('[SaveManager] 自动保存已开启');
    }

    // 停止自动保存
    public stopAutoSave(): void {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
            console.log('[SaveManager] 自动保存已停止');
        }
    }

    // 获取存档信息
    public getSaveInfo(): { exists: boolean; timestamp: number; version: string } {
        const saveString = localStorage.getItem(SAVE_KEY);
        if (!saveString) {
            return { exists: false, timestamp: 0, version: '' };
        }
        
        try {
            const data: SaveData = JSON.parse(saveString);
            return {
                exists: true,
                timestamp: data.timestamp,
                version: data.version
            };
        } catch {
            return { exists: false, timestamp: 0, version: '' };
        }
    }
}

// 单例实例
export const saveManager = new SaveManager();
export default saveManager;

// ==================== 使用示例 ====================
/*
// 初始化
saveManager.init();

// 保存游戏
const currentData = saveManager.load();
currentData.player.gold += 100;
saveManager.save(currentData);

// 导出存档（复制到剪贴板）
const exportData = saveManager.export();
navigator.clipboard.writeText(exportData);

// 导入存档
const importData = prompt('请输入存档代码:');
if (importData) {
    saveManager.import(importData);
}

// 删除存档（新游戏）
saveManager.delete();
*/
