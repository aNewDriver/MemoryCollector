/**
 * 成就徽章/称号系统
 * 展示玩家荣誉和成就
 */

export enum BadgeType {
    COMBAT = 'combat',       // 战斗成就
    COLLECTION = 'collection', // 收集成就
    SOCIAL = 'social',       // 社交成就
    EVENT = 'event',         // 活动成就
    SPECIAL = 'special'      // 特殊成就
}

export interface Badge {
    id: string;
    type: BadgeType;
    name: string;
    description: string;
    icon: string;
    
    // 解锁条件
    requirement: {
        type: string;
        value: number;
    };
    
    // 奖励
    reward?: {
        title?: string;
        frame?: string;
        stats?: { type: string; value: number };
    };
    
    // 稀有度
    rarity: number;
    
    // 是否隐藏（达成前不可见）
    isHidden: boolean;
}

export interface Title {
    id: string;
    name: string;
    description: string;
    color: string;  // 颜色代码
    
    // 获取方式
    source: {
        type: 'badge' | 'ranking' | 'event' | 'vip';
        sourceId?: string;
    };
    
    // 属性加成
    bonus?: {
        type: string;
        value: number;
    };
}

export class BadgeSystem {
    private badges: Map<string, Badge> = new Map();
    private titles: Map<string, Title> = new Map();
    private playerBadges: Map<string, Set<string>> = new Map();  // playerId -> badgeIds
    private playerTitles: Map<string, Set<string>> = new Map();
    private equippedTitle: Map<string, string> = new Map();
    
    constructor() {
        this.initializeDefaultBadges();
        this.initializeDefaultTitles();
    }
    
    private initializeDefaultBadges(): void {
        const defaultBadges: Badge[] = [
            // 战斗徽章
            { id: 'badge_first_blood', type: BadgeType.COMBAT, name: '初战告捷', description: '完成第一场战斗', icon: 'badges/first_blood.bmp', requirement: { type: 'battle_win', value: 1 }, rarity: 1, isHidden: false },
            { id: 'badge_veteran', type: BadgeType.COMBAT, name: '百战老兵', description: '胜利100场', icon: 'badges/veteran.bmp', requirement: { type: 'battle_win', value: 100 }, rarity: 2, isHidden: false },
            { id: 'badge_legend', type: BadgeType.COMBAT, name: '传说战士', description: '胜利10000场', icon: 'badges/legend.bmp', requirement: { type: 'battle_win', value: 10000 }, reward: { title: '传说战士' }, rarity: 5, isHidden: false },
            
            // 收集徽章
            { id: 'badge_collector', type: BadgeType.COLLECTION, name: '收集者', description: '收集10张卡牌', icon: 'badges/collector.bmp', requirement: { type: 'card_collect', value: 10 }, rarity: 1, isHidden: false },
            { id: 'badge_master', type: BadgeType.COLLECTION, name: '卡牌大师', description: '收集100张卡牌', icon: 'badges/master.bmp', requirement: { type: 'card_collect', value: 100 }, rarity: 3, isHidden: false },
            { id: 'badge_completionist', type: BadgeType.COLLECTION, name: '完美收藏家', description: '收集所有卡牌', icon: 'badges/completionist.bmp', requirement: { type: 'card_collect', value: 700 }, reward: { title: '收藏家' }, rarity: 5, isHidden: true },
            
            // 社交徽章
            { id: 'badge_social', type: BadgeType.SOCIAL, name: '社交达人', description: '添加10个好友', icon: 'badges/social.bmp', requirement: { type: 'friend_add', value: 10 }, rarity: 1, isHidden: false },
            { id: 'badge_guild_master', type: BadgeType.SOCIAL, name: '公会领袖', description: '创建公会并达到10级', icon: 'badges/guild_master.bmp', requirement: { type: 'guild_level', value: 10 }, reward: { title: '公会会长' }, rarity: 4, isHidden: false },
            
            // 特殊徽章
            { id: 'badge_beta', type: BadgeType.SPECIAL, name: '开服元老', description: '参与游戏首次测试', icon: 'badges/beta.bmp', requirement: { type: 'beta_participate', value: 1 }, reward: { frame: 'beta_frame' }, rarity: 5, isHidden: false },
            { id: 'badge_whale', type: BadgeType.SPECIAL, name: '氪金大佬', description: '累计充值10000元', icon: 'badges/whale.bmp', requirement: { type: 'recharge_amount', value: 10000 }, reward: { title: '至尊VIP' }, rarity: 5, isHidden: false }
        ];
        
        defaultBadges.forEach(badge => this.badges.set(badge.id, badge));
    }
    
    private initializeDefaultTitles(): void {
        const defaultTitles: Title[] = [
            { id: 'title_newbie', name: '新晋回收者', description: '初入记忆的回收者', color: '#808080', source: { type: 'badge', sourceId: 'badge_first_blood' } },
            { id: 'title_veteran', name: '传说战士', description: '百战百胜的战士', color: '#FFD700', source: { type: 'badge', sourceId: 'badge_legend' }, bonus: { type: 'atk', value: 5 } },
            { id: 'title_collector', name: '收藏家', description: '集齐所有卡牌的收藏家', color: '#FF69B4', source: { type: 'badge', sourceId: 'badge_completionist' }, bonus: { type: 'hp', value: 10 } },
            { id: 'title_vip', name: '至尊VIP', description: '尊贵的大佬', color: '#FF0000', source: { type: 'badge', sourceId: 'badge_whale' }, bonus: { type: 'gold_earn', value: 20 } },
            { id: 'title_guild_master', name: '公会会长', description: '统领公会的领袖', color: '#4169E1', source: { type: 'badge', sourceId: 'badge_guild_master' } }
        ];
        
        defaultTitles.forEach(title => this.titles.set(title.id, title));
    }
    
    // 检查并解锁徽章
    public checkAndUnlock(playerId: string, actionType: string, value: number): Badge[] {
        const unlocked: Badge[] = [];
        
        this.badges.forEach(badge => {
            if (badge.requirement.type === actionType && value >= badge.requirement.value) {
                if (this.unlockBadge(playerId, badge.id)) {
                    unlocked.push(badge);
                }
            }
        });
        
        return unlocked;
    }
    
    // 解锁徽章
    private unlockBadge(playerId: string, badgeId: string): boolean {
        if (!this.playerBadges.has(playerId)) {
            this.playerBadges.set(playerId, new Set());
        }
        
        const badges = this.playerBadges.get(playerId)!;
        if (badges.has(badgeId)) return false;
        
        badges.add(badgeId);
        
        // 检查是否有关联称号
        const badge = this.badges.get(badgeId);
        if (badge?.reward?.title) {
            // 找到对应的称号并解锁
            this.titles.forEach((title, id) => {
                if (title.source.type === 'badge' && title.source.sourceId === badgeId) {
                    this.unlockTitle(playerId, id);
                }
            });
        }
        
        return true;
    }
    
    // 解锁称号
    private unlockTitle(playerId: string, titleId: string): boolean {
        if (!this.playerTitles.has(playerId)) {
            this.playerTitles.set(playerId, new Set());
        }
        
        const titles = this.playerTitles.get(playerId)!;
        if (titles.has(titleId)) return false;
        
        titles.add(titleId);
        return true;
    }
    
    // 装备称号
    public equipTitle(playerId: string, titleId: string): boolean {
        const titles = this.playerTitles.get(playerId);
        if (!titles?.has(titleId)) return false;
        
        this.equippedTitle.set(playerId, titleId);
        return true;
    }
    
    // 获取玩家已解锁的徽章
    public getPlayerBadges(playerId: string): Badge[] {
        const badgeIds = this.playerBadges.get(playerId);
        if (!badgeIds) return [];
        
        return Array.from(badgeIds)
            .map(id => this.badges.get(id))
            .filter((b): b is Badge => b !== undefined);
    }
    
    // 获取玩家已解锁的称号
    public getPlayerTitles(playerId: string): Title[] {
        const titleIds = this.playerTitles.get(playerId);
        if (!titleIds) return [];
        
        return Array.from(titleIds)
            .map(id => this.titles.get(id))
            .filter((t): t is Title => t !== undefined);
    }
    
    // 获取当前装备的称号
    public getEquippedTitle(playerId: string): Title | null {
        const titleId = this.equippedTitle.get(playerId);
        if (!titleId) return null;
        return this.titles.get(titleId) || null;
    }
}

// 单例
export const badgeSystem = new BadgeSystem();
