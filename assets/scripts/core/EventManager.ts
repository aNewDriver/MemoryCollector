/**
 * 全局事件系统
 * 用于模块间的解耦通信
 */

export enum GameEvent {
    // 玩家数据相关
    PLAYER_LEVEL_UP = 'player_level_up',
    PLAYER_EXP_CHANGED = 'player_exp_changed',
    GOLD_CHANGED = 'gold_changed',
    CRYSTAL_CHANGED = 'crystal_changed',
    
    // 卡牌相关
    CARD_ACQUIRED = 'card_acquired',
    CARD_LEVEL_UP = 'card_level_up',
    CARD_ASCENDED = 'card_ascended',
    CARD_AWAKENED = 'card_awakened',
    CARD_EQUIPPED = 'card_equipped',
    
    // 战斗相关
    BATTLE_START = 'battle_start',
    BATTLE_END = 'battle_end',
    BATTLE_VICTORY = 'battle_victory',
    BATTLE_DEFEAT = 'battle_defeat',
    LEVEL_COMPLETED = 'level_completed',
    CHAPTER_COMPLETED = 'chapter_completed',
    
    // 抽卡相关
    GACHA_START = 'gacha_start',
    GACHA_RESULT = 'gacha_result',
    GACHA_COMPLETE = 'gacha_complete',
    
    // 任务相关
    TASK_COMPLETED = 'task_completed',
    TASK_REWARD_CLAIMED = 'task_reward_claimed',
    ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
    
    // 系统相关
    SCENE_CHANGED = 'scene_changed',
    SETTINGS_CHANGED = 'settings_changed',
    GAME_SAVED = 'game_saved',
    GAME_LOADED = 'game_loaded',
    
    // 背包相关
    ITEM_ACQUIRED = 'item_acquired',
    ITEM_CONSUMED = 'item_consumed',
    EQUIPMENT_ENHANCED = 'equipment_enhanced',
    
    // 商店相关
    ITEM_PURCHASED = 'item_purchased',
    SHOP_REFRESHED = 'shop_refreshed',
    
    // 爬塔相关
    TOWER_FLOOR_REACHED = 'tower_floor_reached',
    TOWER_RECORD_BROKEN = 'tower_record_broken'
}

type EventCallback = (data?: any) => void;

export class EventManager {
    private listeners: Map<GameEvent | string, EventCallback[]> = new Map();
    
    /**
     * 监听事件
     */
    public on(event: GameEvent | string, callback: EventCallback): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        
        this.listeners.get(event)!.push(callback);
        
        // 返回取消监听的函数
        return () => this.off(event, callback);
    }
    
    /**
     * 取消监听
     */
    public off(event: GameEvent | string, callback: EventCallback): void {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    
    /**
     * 触发事件
     */
    public emit(event: GameEvent | string, data?: any): void {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            // 复制数组防止在回调中修改监听列表
            [...callbacks].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event handler for ${event}:`, error);
                }
            });
        }
    }
    
    /**
     * 只监听一次
     */
    public once(event: GameEvent | string, callback: EventCallback): void {
        const onceCallback = (data?: any) => {
            this.off(event, onceCallback);
            callback(data);
        };
        this.on(event, onceCallback);
    }
    
    /**
     * 清除所有监听
     */
    public clear(): void {
        this.listeners.clear();
    }
    
    /**
     * 清除指定事件的所有监听
     */
    public clearEvent(event: GameEvent | string): void {
        this.listeners.delete(event);
    }
    
    /**
     * 获取指定事件的监听器数量
     */
    public listenerCount(event: GameEvent | string): number {
        return this.listeners.get(event)?.length || 0;
    }
}

// 单例
export const eventManager = new EventManager();

// 便捷导出
export const { on, off, emit, once } = eventManager;
