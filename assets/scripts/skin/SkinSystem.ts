/**
 * 皮肤/外观系统
 * 角色换装、特效皮肤、头像框
 */

export enum SkinType {
    CHARACTER = 'character',   // 角色皮肤
    CARD = 'card',             // 卡牌皮肤
    AVATAR = 'avatar',         // 头像
    FRAME = 'frame',           // 头像框
    BUBBLE = 'bubble',         // 聊天气泡
    EFFECT = 'effect'          // 特效（技能/升级等）
}

export interface Skin {
    id: string;
    type: SkinType;
    name: string;
    description: string;
    
    // 适用对象
    targetId?: string;  // 如果是角色/卡牌皮肤，对应ID
    
    // 资源路径
    resources: {
        icon: string;
        preview: string;
        full?: string;
        animations?: string[];
    };
    
    // 特效
    effects?: {
        type: string;
        resource: string;
    }[];
    
    // 获取方式
    acquisition: {
        type: 'shop' | 'event' | 'achievement' | 'gacha' | 'vip' | 'limited';
        price?: { currency: string; amount: number };
        eventId?: string;
        achievementId?: string;
        vipLevel?: number;
    };
    
    // 限时信息
    isLimited: boolean;
    availableFrom?: number;
    availableTo?: number;
    
    // 品质
    rarity: number;  // 1-5
}

export interface PlayerSkinData {
    playerId: string;
    ownedSkins: string[];           // 已拥有的皮肤ID
    equipped: {                     // 当前装备的皮肤
        [SkinType.CHARACTER]?: string;
        [SkinType.AVATAR]?: string;
        [SkinType.FRAME]?: string;
        [SkinType.BUBBLE]?: string;
        [SkinType.EFFECT]?: string;
    };
    favorites: string[];            // 收藏的皮肤
}

export class SkinSystem {
    private skins: Map<string, Skin> = new Map();
    private playerData: Map<string, PlayerSkinData> = new Map();
    
    // 注册皮肤
    public registerSkin(skin: Skin): void {
        this.skins.set(skin.id, skin);
    }
    
    // 获取皮肤
    public getSkin(skinId: string): Skin | null {
        return this.skins.get(skinId) || null;
    }
    
    // 获取所有皮肤
    public getAllSkins(type?: SkinType): Skin[] {
        const skins = Array.from(this.skins.values());
        if (type) {
            return skins.filter(s => s.type === type);
        }
        return skins;
    }
    
    // 获取可购买的皮肤
    public getShopSkins(): Skin[] {
        return this.getAllSkins().filter(s => 
            s.acquisition.type === 'shop' && this.isAvailable(s)
        );
    }
    
    // 检查皮肤是否可获得
    public isAvailable(skin: Skin): boolean {
        if (!skin.isLimited) return true;
        
        const now = Date.now();
        if (skin.availableFrom && now < skin.availableFrom) return false;
        if (skin.availableTo && now > skin.availableTo) return false;
        
        return true;
    }
    
    // 玩家购买皮肤
    public purchaseSkin(
        playerId: string,
        skinId: string,
        currency: string,
        amount: number
    ): { success: boolean; error?: string } {
        const skin = this.skins.get(skinId);
        if (!skin) return { success: false, error: '皮肤不存在' };
        
        if (!this.isAvailable(skin)) {
            return { success: false, error: '皮肤不可用' };
        }
        
        const data = this.getPlayerData(playerId);
        if (data.ownedSkins.includes(skinId)) {
            return { success: false, error: '已拥有该皮肤' };
        }
        
        // TODO: 扣除货币
        
        data.ownedSkins.push(skinId);
        return { success: true };
    }
    
    // 装备皮肤
    public equipSkin(playerId: string, skinId: string): { success: boolean; error?: string } {
        const skin = this.skins.get(skinId);
        if (!skin) return { success: false, error: '皮肤不存在' };
        
        const data = this.getPlayerData(playerId);
        if (!data.ownedSkins.includes(skinId)) {
            return { success: false, error: '未拥有该皮肤' };
        }
        
        data.equipped[skin.type] = skinId;
        return { success: true };
    }
    
    // 卸下皮肤
    public unequipSkin(playerId: string, type: SkinType): void {
        const data = this.getPlayerData(playerId);
        delete data.equipped[type];
    }
    
    // 获取玩家装备的皮肤
    public getEquippedSkins(playerId: string): PlayerSkinData['equipped'] {
        return this.getPlayerData(playerId).equipped;
    }
    
    // 获取玩家拥有的皮肤
    public getOwnedSkins(playerId: string): Skin[] {
        const data = this.getPlayerData(playerId);
        return data.ownedSkins
            .map(id => this.skins.get(id))
            .filter((s): s is Skin => s !== undefined);
    }
    
    // 添加皮肤（通过活动、成就等）
    public grantSkin(playerId: string, skinId: string): boolean {
        const skin = this.skins.get(skinId);
        if (!skin) return false;
        
        const data = this.getPlayerData(playerId);
        if (data.ownedSkins.includes(skinId)) return false;
        
        data.ownedSkins.push(skinId);
        return true;
    }
    
    // 获取玩家数据
    private getPlayerData(playerId: string): PlayerSkinData {
        if (!this.playerData.has(playerId)) {
            this.playerData.set(playerId, {
                playerId,
                ownedSkins: [],
                equipped: {},
                favorites: []
            });
        }
        return this.playerData.get(playerId)!;
    }
    
    // 创建默认皮肤
    public createDefaultSkins(): void {
        // 默认头像框
        this.registerSkin({
            id: 'frame_default',
            type: SkinType.FRAME,
            name: '默认边框',
            description: '普通玩家的头像框',
            resources: { icon: 'skins/frame_default.bmp', preview: 'skins/frame_default.bmp' },
            acquisition: { type: 'achievement' },
            isLimited: false,
            rarity: 1
        });
        
        // VIP头像框
        this.registerSkin({
            id: 'frame_vip',
            type: SkinType.FRAME,
            name: 'VIP专属',
            description: 'VIP玩家的尊贵头像框',
            resources: { icon: 'skins/frame_vip.bmp', preview: 'skins/frame_vip.bmp' },
            acquisition: { type: 'vip', vipLevel: 1 },
            isLimited: false,
            rarity: 3
        });
        
        // 限定头像框
        this.registerSkin({
            id: 'frame_limited',
            type: SkinType.FRAME,
            name: '开服限定',
            description: '开服活动期间获得的限定头像框',
            resources: { icon: 'skins/frame_limited.bmp', preview: 'skins/frame_limited.bmp' },
            acquisition: { type: 'limited' },
            isLimited: true,
            availableFrom: Date.now(),
            availableTo: Date.now() + 30 * 24 * 60 * 60 * 1000,
            rarity: 5
        });
    }
}

// 单例
export const skinSystem = new SkinSystem();
