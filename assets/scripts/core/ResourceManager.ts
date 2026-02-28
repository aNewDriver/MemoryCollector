/**
 * 资源加载管理器
 * 预加载和缓存游戏资源
 */

import { _decorator, Component, AssetManager, assetManager, Prefab, SpriteFrame, AudioClip } from 'cc';

const { ccclass, property } = _decorator;

interface LoadTask {
    path: string;
    type: typeof Prefab | typeof SpriteFrame | typeof AudioClip;
    onComplete?: (asset: any) => void;
    onError?: (error: Error) => void;
}

@ccclass('ResourceManager')
export class ResourceManager extends Component {
    
    private static _instance: ResourceManager | null = null;
    public static get instance(): ResourceManager {
        return ResourceManager._instance!;
    }
    
    // 资源缓存
    private cache: Map<string, any> = new Map();
    
    // 加载队列
    private loadQueue: LoadTask[] = [];
    private isLoading: boolean = false;
    
    // 预加载配置
    private preloadConfig = {
        prefabs: [
            'prefabs/ui/CommonButton',
            'prefabs/ui/HealthBar',
            'prefabs/ui/CardDisplay',
            'prefabs/popups/AlertPopup',
            'prefabs/popups/ConfirmPopup',
            'prefabs/popups/RewardPopup'
        ],
        sprites: [
            'images/cards/jin_yu_portrait',
            'images/cards/qing_yi_portrait',
            'images/cards/zhu_feng_portrait',
            'images/cards/yan_xin_portrait',
            'images/cards/ming_zhu_portrait',
            'images/cards/can_ying_portrait'
        ],
        audio: [
            'audio/bgm/main_theme',
            'audio/sfx/button_click',
            'audio/sfx/battle_start'
        ]
    };
    
    onLoad() {
        if (ResourceManager._instance) {
            this.destroy();
            return;
        }
        ResourceManager._instance = this;
    }
    
    // ============ 预加载 ============
    
    public async preloadAll(onProgress?: (progress: number) => void): Promise<void> {
        const allAssets = [
            ...this.preloadConfig.prefabs.map(p => ({ path: p, type: Prefab })),
            ...this.preloadConfig.sprites.map(p => ({ path: p, type: SpriteFrame })),
            ...this.preloadConfig.audio.map(p => ({ path: p, type: AudioClip }))
        ];
        
        let loaded = 0;
        const total = allAssets.length;
        
        for (const asset of allAssets) {
            await this.loadAsset(asset.path, asset.type);
            loaded++;
            onProgress?.(loaded / total);
        }
        
        console.log(`预加载完成: ${loaded} 个资源`);
    }
    
    // ============ 资源加载 ============
    
    public loadAsset<T>(path: string, type: new () => T): Promise<T | null> {
        return new Promise((resolve) => {
            // 检查缓存
            if (this.cache.has(path)) {
                resolve(this.cache.get(path));
                return;
            }
            
            // 加载资源
            assetManager.loadAny({ path, type }, (err, asset) => {
                if (err) {
                    console.warn(`加载资源失败: ${path}`, err);
                    resolve(null);
                    return;
                }
                
                // 缓存资源
                this.cache.set(path, asset);
                resolve(asset);
            });
        });
    }
    
    public loadPrefab(path: string): Promise<Prefab | null> {
        return this.loadAsset(path, Prefab);
    }
    
    public loadSpriteFrame(path: string): Promise<SpriteFrame | null> {
        return this.loadAsset(path, SpriteFrame);
    }
    
    public loadAudioClip(path: string): Promise<AudioClip | null> {
        return this.loadAsset(path, AudioClip);
    }
    
    // ============ 批量加载 ============
    
    public async loadBatch(
        paths: string[], 
        type: any,
        onProgress?: (current: number, total: number) => void
    ): Promise<Map<string, any>> {
        const results = new Map<string, any>();
        
        for (let i = 0; i < paths.length; i++) {
            const asset = await this.loadAsset(paths[i], type);
            results.set(paths[i], asset);
            onProgress?.(i + 1, paths.length);
        }
        
        return results;
    }
    
    // ============ 缓存管理 ============
    
    public getFromCache<T>(path: string): T | null {
        return this.cache.get(path) || null;
    }
    
    public hasCache(path: string): boolean {
        return this.cache.has(path);
    }
    
    public clearCache(): void {
        this.cache.clear();
        assetManager.releaseAll();
    }
    
    public releaseAsset(path: string): void {
        if (this.cache.has(path)) {
            const asset = this.cache.get(path);
            assetManager.releaseAsset(asset);
            this.cache.delete(path);
        }
    }
    
    // ============ 资源路径生成器 ============
    
    // 获取卡牌立绘路径
    public getCardPortraitPath(cardId: string): string {
        return `images/cards/${cardId}_portrait`;
    }
    
    // 获取卡牌全身立绘路径
    public getCardFullbodyPath(cardId: string): string {
        return `images/cards/${cardId}_fullbody`;
    }
    
    // 获取技能图标路径
    public getSkillIconPath(skillId: string): string {
        return `images/skills/${skillId}`;
    }
    
    // 获取装备图标路径
    public getEquipmentIconPath(equipmentId: string): string {
        return `images/equipment/${equipmentId}`;
    }
    
    // 获取物品图标路径
    public getItemIconPath(itemId: string): string {
        return `images/items/${itemId}`;
    }
}

// 单例
export const resourceManager = ResourceManager.instance;
