/**
 * 个性化推荐系统
 * 根据玩家行为推荐内容
 */

export enum RecommendationType {
    CARD = 'card',           // 卡牌推荐
    DECK = 'deck',           // 阵容推荐
    ACTIVITY = 'activity',   // 活动推荐
    SHOP = 'shop',           // 商品推荐
    CHALLENGE = 'challenge'  // 挑战推荐
}

export interface Recommendation {
    id: string;
    type: RecommendationType;
    title: string;
    description: string;
    
    // 推荐内容
    targetId: string;
    
    // 推荐理由
    reason: string;
    
    // 优先级
    priority: number;
    
    // 有效期
    validUntil?: number;
    
    // 是否已查看
    isViewed: boolean;
    
    // 是否已点击
    isClicked: boolean;
}

export class RecommendationSystem {
    private recommendations: Map<string, Recommendation[]> = new Map();
    private cardSynergies: Map<string, string[]> = new Map();  // cardId -> synergies
    
    constructor() {
        this.initializeCardSynergies();
    }
    
    private initializeCardSynergies(): void {
        // 定义卡牌协同关系
        this.cardSynergies.set('jin_yu', ['jin_li', 'jin_song']);
        this.cardSynergies.set('mu_lan', ['mu_yao', 'mu_feng']);
        this.cardSynergies.set('shui_yue', ['shui_xin', 'shui_lan']);
        this.cardSynergies.set('huo_ling', ['huo_yan', 'huo_wu']);
        this.cardSynergies.set('tu_hou', ['tu_shan', 'tu_chen']);
        this.cardSynergies.set('guang_hui', ['guang_ming', 'guang_yao']);
        this.cardSynergies.set('an_ying', ['an_hei', 'an_ye']);
    }
    
    // 生成推荐
    public generateRecommendations(
        playerId: string,
        ownedCards: string[],
        playerLevel: number,
        recentActivities: string[]
    ): Recommendation[] {
        const recommendations: Recommendation[] = [];
        
        // 1. 卡牌推荐 - 基于已有卡牌协同
        const cardRecs = this.generateCardRecommendations(ownedCards);
        recommendations.push(...cardRecs);
        
        // 2. 阵容推荐 - 基于已有卡牌
        const deckRecs = this.generateDeckRecommendations(ownedCards);
        recommendations.push(...deckRecs);
        
        // 3. 活动推荐 - 基于等级和近期行为
        const activityRecs = this.generateActivityRecommendations(playerLevel, recentActivities);
        recommendations.push(...activityRecs);
        
        // 4. 挑战推荐 - 基于战力
        const challengeRecs = this.generateChallengeRecommendations(playerLevel);
        recommendations.push(...challengeRecs);
        
        // 排序并存储
        recommendations.sort((a, b) => b.priority - a.priority);
        this.recommendations.set(playerId, recommendations);
        
        return recommendations;
    }
    
    // 生成卡牌推荐
    private generateCardRecommendations(ownedCards: string[]): Recommendation[] {
        const recommendations: Recommendation[] = [];
        const synergies = new Set<string>();
        
        // 找出协同卡牌
        ownedCards.forEach(cardId => {
            const cardSynergies = this.cardSynergies.get(cardId);
            if (cardSynergies) {
                cardSynergies.forEach(id => {
                    if (!ownedCards.includes(id)) {
                        synergies.add(id);
                    }
                });
            }
        });
        
        // 生成推荐
        synergies.forEach((cardId, index) => {
            recommendations.push({
                id: `rec_card_${cardId}_${Date.now()}`,
                type: RecommendationType.CARD,
                title: '协同卡牌推荐',
                description: `这张卡牌与你的阵容有很好的协同效果`,
                targetId: cardId,
                reason: '阵容协同',
                priority: 80 - index * 10,
                isViewed: false,
                isClicked: false
            });
        });
        
        return recommendations;
    }
    
    // 生成阵容推荐
    private generateDeckRecommendations(ownedCards: string[]): Recommendation[] {
        const recommendations: Recommendation[] = [];
        
        // 检查是否缺少某个元素
        const elements = new Set(ownedCards.map(id => id.split('_')[0]));
        const allElements = ['jin', 'mu', 'shui', 'huo', 'tu'];
        const missingElements = allElements.filter(e => !elements.has(e));
        
        if (missingElements.length > 0) {
            recommendations.push({
                id: `rec_deck_${Date.now()}`,
                type: RecommendationType.DECK,
                title: '完善元素阵容',
                description: `建议补充${missingElements.join('/')}属性卡牌，完善克制体系`,
                targetId: 'element_balance',
                reason: '阵容完整性',
                priority: 90,
                isViewed: false,
                isClicked: false
            });
        }
        
        return recommendations;
    }
    
    // 生成活动推荐
    private generateActivityRecommendations(
        playerLevel: number,
        recentActivities: string[]
    ): Recommendation[] {
        const recommendations: Recommendation[] = [];
        
        // 如果最近没打竞技场
        if (!recentActivities.includes('arena')) {
            recommendations.push({
                id: `rec_activity_arena_${Date.now()}`,
                type: RecommendationType.ACTIVITY,
                title: '竞技场挑战',
                description: '竞技场排名奖励丰厚，快来挑战吧！',
                targetId: 'arena',
                reason: '未参与',
                priority: 70,
                isViewed: false,
                isClicked: false
            });
        }
        
        // 如果等级足够但没加入公会
        if (playerLevel >= 15 && !recentActivities.includes('guild')) {
            recommendations.push({
                id: `rec_activity_guild_${Date.now()}`,
                type: RecommendationType.ACTIVITY,
                title: '加入公会',
                description: '公会有丰富的福利和活动等你参与',
                targetId: 'guild',
                reason: '等级达标',
                priority: 85,
                isViewed: false,
                isClicked: false
            });
        }
        
        return recommendations;
    }
    
    // 生成挑战推荐
    private generateChallengeRecommendations(playerLevel: number): Recommendation[] {
        const recommendations: Recommendation[] = [];
        
        // 根据等级推荐适合的挑战
        if (playerLevel >= 20) {
            recommendations.push({
                id: `rec_challenge_tower_${Date.now()}`,
                type: RecommendationType.CHALLENGE,
                title: '无限之塔',
                description: '挑战无限之塔，获取丰厚奖励',
                targetId: 'tower',
                reason: '等级解锁',
                priority: 75,
                isViewed: false,
                isClicked: false
            });
        }
        
        if (playerLevel >= 30) {
            recommendations.push({
                id: `rec_challenge_endless_${Date.now()}`,
                type: RecommendationType.CHALLENGE,
                title: '无尽试炼',
                description: '高难度挑战，检验你的实力',
                targetId: 'endless',
                reason: '等级解锁',
                priority: 60,
                isViewed: false,
                isClicked: false
            });
        }
        
        return recommendations;
    }
    
    // 获取玩家推荐
    public getRecommendations(playerId: string): Recommendation[] {
        return this.recommendations.get(playerId) || [];
    }
    
    // 获取未读推荐
    public getUnreadRecommendations(playerId: string): Recommendation[] {
        const recs = this.recommendations.get(playerId) || [];
        return recs.filter(r => !r.isViewed);
    }
    
    // 标记已查看
    public markAsViewed(playerId: string, recommendationId: string): void {
        const recs = this.recommendations.get(playerId);
        if (!recs) return;
        
        const rec = recs.find(r => r.id === recommendationId);
        if (rec) rec.isViewed = true;
    }
    
    // 标记已点击
    public markAsClicked(playerId: string, recommendationId: string): void {
        const recs = this.recommendations.get(playerId);
        if (!recs) return;
        
        const rec = recs.find(r => r.id === recommendationId);
        if (rec) rec.isClicked = true;
    }
    
    // 清除过期推荐
    public clearExpiredRecommendations(playerId: string): void {
        const recs = this.recommendations.get(playerId);
        if (!recs) return;
        
        const now = Date.now();
        const validRecs = recs.filter(r => !r.validUntil || r.validUntil > now);
        this.recommendations.set(playerId, validRecs);
    }
}

// 单例
export const recommendationSystem = new RecommendationSystem();
