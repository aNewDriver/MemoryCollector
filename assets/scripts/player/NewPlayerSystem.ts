/**
 * 新手初始化系统
 * 初始卡牌发放、新玩家引导奖励
 */

import { CardInstance } from '../data/CardData';
import { Rarity } from '../data/CardDatabase';

export interface StarterPack {
    cards: { cardId: string; level: number; ascension: number }[];
    items: { itemId: string; count: number }[];
    currency: { gold: number; soulCrystal: number };
}

export class NewPlayerSystem {
    // 初始卡牌配置
    private starterCards = {
        // 必定获得的初始卡牌
        guaranteed: [
            { cardId: 'jin_yu', level: 1, ascension: 0 },      // 金元素基础卡
            { cardId: 'mu_lan', level: 1, ascension: 0 },      // 木元素基础卡
            { cardId: 'shui_yue', level: 1, ascension: 0 },    // 水元素基础卡
            { cardId: 'huo_ling', level: 1, ascension: 0 },    // 火元素基础卡
            { cardId: 'tu_hou', level: 1, ascension: 0 }       // 土元素基础卡
        ],
        // 五选一的新手SSR
        ssrChoice: [
            'jin_long',    // 金龙
            'mu_shen',     // 木神
            'shui_di',     // 水帝
            'huo_feng',    // 火凤
            'tu_huang'     // 土皇
        ]
    };
    
    // 新手礼包内容
    private starterPack: StarterPack = {
        cards: [],
        items: [
            { itemId: 'exp_potion_small', count: 10 },
            { itemId: 'gold_chest', count: 3 },
            { itemId: 'equipment_box', count: 2 },
            { itemId: 'gacha_ticket', count: 10 },
            { itemId: 'memory_dust', count: 5000 }
        ],
        currency: {
            gold: 100000,
            soulCrystal: 500
        }
    };
    
    /**
     * 发放新手初始奖励
     * 在玩家首次进入游戏时调用
     */
    public grantStarterPack(playerId: string): {
        success: boolean;
        granted?: {
            cards: CardInstance[];
            items: typeof this.starterPack.items;
            currency: typeof this.starterPack.currency;
        };
        error?: string;
    } {
        try {
            // 检查是否已发放
            if (this.hasReceivedStarterPack(playerId)) {
                return { success: false, error: '新手奖励已发放' };
            }
            
            // 1. 发放基础五行卡牌
            const grantedCards: CardInstance[] = [];
            this.starterCards.guaranteed.forEach(starter => {
                const card = this.createCardInstance(
                    starter.cardId,
                    starter.level,
                    starter.ascension
                );
                grantedCards.push(card);
            });
            
            // 2. 发放新手SSR（让玩家选择）
            // 这里只返回可选列表，实际选择后通过 selectStarterSSR 发放
            
            // 3. 发放道具
            const grantedItems = [...this.starterPack.items];
            
            // 4. 发放货币
            const grantedCurrency = { ...this.starterPack.currency };
            
            // 标记已发放
            this.markStarterPackReceived(playerId);
            
            console.log(`[NewPlayer] Starter pack granted to ${playerId}`);
            
            return {
                success: true,
                granted: {
                    cards: grantedCards,
                    items: grantedItems,
                    currency: grantedCurrency
                }
            };
        } catch (error) {
            console.error('[NewPlayer] Failed to grant starter pack:', error);
            return { success: false, error: '发放失败' };
        }
    }
    
    /**
     * 获取可选的新手SSR列表
     */
    public getStarterSSRChoices(): { cardId: string; name: string; description: string }[] {
        return this.starterCards.ssrChoice.map(id => ({
            cardId: id,
            name: this.getCardName(id),
            description: this.getCardDescription(id)
        }));
    }
    
    /**
     * 选择新手SSR
     */
    public selectStarterSSR(
        playerId: string,
        cardId: string
    ): {
        success: boolean;
        card?: CardInstance;
        error?: string;
    } {
        // 验证是否为合法选项
        if (!this.starterCards.ssrChoice.includes(cardId)) {
            return { success: false, error: '非法的卡牌选择' };
        }
        
        // 检查是否已选择
        if (this.hasSelectedStarterSSR(playerId)) {
            return { success: false, error: '已选择过新手SSR' };
        }
        
        // 创建SSR卡牌
        const card = this.createCardInstance(cardId, 1, 0);
        card.rarity = Rarity.GOLD;  // SSR
        
        // 标记已选择
        this.markStarterSSRSelected(playerId, cardId);
        
        console.log(`[NewPlayer] Player ${playerId} selected starter SSR: ${cardId}`);
        
        return { success: true, card };
    }
    
    /**
     * 创建卡牌实例
     */
    private createCardInstance(
        cardId: string,
        level: number,
        ascension: number
    ): CardInstance {
        return {
            instanceId: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            cardId,
            level,
            ascension,
            exp: 0,
            skillLevel: [1, 1, 1],
            intimacy: 0,
            isAwakened: false,
            equipment: {},
            skinId: null
        };
    }
    
    /**
     * 发放七日登录奖励
     */
    public grantDailyLoginReward(
        playerId: string,
        day: number
    ): {
        success: boolean;
        rewards?: any;
        error?: string;
    } {
        const rewards = this.getDailyLoginReward(day);
        if (!rewards) {
            return { success: false, error: '无效的登录天数' };
        }
        
        console.log(`[NewPlayer] Day ${day} login reward granted to ${playerId}`);
        
        return { success: true, rewards };
    }
    
    /**
     * 获取七日登录奖励配置
     */
    private getDailyLoginReward(day: number): any | null {
        const rewards: Record<number, any> = {
            1: { gold: 10000, items: [{ itemId: 'gacha_ticket', count: 1 }] },
            2: { gold: 15000, items: [{ itemId: 'exp_potion_small', count: 5 }] },
            3: { gold: 20000, soulCrystal: 100 },
            4: { gold: 25000, items: [{ itemId: 'equipment_box', count: 1 }] },
            5: { gold: 30000, soulCrystal: 200 },
            6: { gold: 50000, items: [{ itemId: 'gacha_ticket', count: 3 }] },
            7: { cardId: 'starter_ssr_choice', gold: 100000, soulCrystal: 500 }
        };
        
        return rewards[day] || null;
    }
    
    /**
     * 发放完成新手教程奖励
     */
    public grantTutorialCompletionReward(playerId: string): {
        success: boolean;
        rewards?: any;
    } {
        const rewards = {
            gold: 50000,
            soulCrystal: 300,
            items: [
                { itemId: 'gacha_ticket', count: 5 },
                { itemId: 'exp_potion_medium', count: 3 }
            ],
            cardId: 'tutorial_reward_card'  // 特定奖励卡牌
        };
        
        console.log(`[NewPlayer] Tutorial completion reward granted to ${playerId}`);
        
        return { success: true, rewards };
    }
    
    // 本地存储键
    private readonly STORAGE_KEY = 'new_player_data';
    
    private playerData: Map<string, {
        receivedStarterPack: boolean;
        selectedStarterSSR: string | null;
        dailyLoginDays: number[];
        completedTutorial: boolean;
    }> = new Map();
    
    private hasReceivedStarterPack(playerId: string): boolean {
        return this.playerData.get(playerId)?.receivedStarterPack || false;
    }
    
    private markStarterPackReceived(playerId: string): void {
        if (!this.playerData.has(playerId)) {
            this.playerData.set(playerId, {
                receivedStarterPack: false,
                selectedStarterSSR: null,
                dailyLoginDays: [],
                completedTutorial: false
            });
        }
        this.playerData.get(playerId)!.receivedStarterPack = true;
    }
    
    private hasSelectedStarterSSR(playerId: string): boolean {
        return !!this.playerData.get(playerId)?.selectedStarterSSR;
    }
    
    private markStarterSSRSelected(playerId: string, cardId: string): void {
        const data = this.playerData.get(playerId);
        if (data) {
            data.selectedStarterSSR = cardId;
        }
    }
    
    // 辅助方法
    private getCardName(cardId: string): string {
        const names: Record<string, string> = {
            'jin_long': '金龙',
            'mu_shen': '木神',
            'shui_di': '水帝',
            'huo_feng': '火凤',
            'tu_huang': '土皇'
        };
        return names[cardId] || cardId;
    }
    
    private getCardDescription(cardId: string): string {
        const descriptions: Record<string, string> = {
            'jin_long': '掌控金属之力的传说龙族，攻击凌厉',
            'mu_shen': '自然之力的守护者，拥有强大的恢复能力',
            'shui_di': '深海的主宰，擅长控制与持续伤害',
            'huo_feng': '涅槃重生的不死鸟，爆发力惊人',
            'tu_huang': '大地之力的化身，防御坚不可摧'
        };
        return descriptions[cardId] || '';
    }
}

// 单例
export const newPlayerSystem = new NewPlayerSystem();
