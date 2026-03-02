/**
 * 卡牌融合/进化系统
 * 合成更强大的卡牌
 */

import { CardData, Rarity } from '../data/CardData';

export interface FusionRecipe {
    id: string;
    resultCardId: string;
    ingredients: {
        cardId?: string;
        rarity?: Rarity;
        element?: string;
        count: number;
    }[];
    cost: {
        gold: number;
        materials?: { itemId: string; count: number }[];
    };
    successRate: number;  // 成功率
}

export interface EvolutionPath {
    fromCardId: string;
    toCardId: string;
    requirements: {
        level: number;
        ascension: number;
        affinity: number;
        materials: { itemId: string; count: number }[];
    };
}

export class FusionSystem {
    private recipes: Map<string, FusionRecipe> = new Map();
    private evolutionPaths: Map<string, EvolutionPath[]> = new Map();
    
    // 注册融合配方
    public registerRecipe(recipe: FusionRecipe): void {
        this.recipes.set(recipe.id, recipe);
    }
    
    // 注册进化路径
    public registerEvolution(path: EvolutionPath): void {
        if (!this.evolutionPaths.has(path.fromCardId)) {
            this.evolutionPaths.set(path.fromCardId, []);
        }
        this.evolutionPaths.get(path.fromCardId)!.push(path);
    }
    
    // 检查是否可以融合
    public canFuse(
        playerCards: string[],
        recipeId: string
    ): {
        canFuse: boolean;
        missing?: string[];
    } {
        const recipe = this.recipes.get(recipeId);
        if (!recipe) return { canFuse: false, missing: ['配方不存在'] };
        
        const missing: string[] = [];
        const cardCount = new Map<string, number>();
        
        // 统计玩家卡牌
        playerCards.forEach(cardId => {
            cardCount.set(cardId, (cardCount.get(cardId) || 0) + 1);
        });
        
        // 检查材料
        for (const ingredient of recipe.ingredients) {
            if (ingredient.cardId) {
                const hasCount = cardCount.get(ingredient.cardId) || 0;
                if (hasCount < ingredient.count) {
                    missing.push(`${ingredient.cardId} x${ingredient.count - hasCount}`);
                }
            }
        }
        
        return {
            canFuse: missing.length === 0,
            missing: missing.length > 0 ? missing : undefined
        };
    }
    
    // 执行融合
    public fuse(
        playerId: string,
        recipeId: string
    ): {
        success: boolean;
        result?: string;
        error?: string;
    } {
        // TODO: 获取玩家卡牌并检查
        // const check = this.canFuse(playerCards, recipeId);
        // if (!check.canFuse) return { success: false, error: '材料不足' };
        
        const recipe = this.recipes.get(recipeId);
        if (!recipe) return { success: false, error: '配方不存在' };
        
        // 计算成功率
        const roll = Math.random() * 100;
        if (roll > recipe.successRate) {
            return { success: false, error: '融合失败，材料已消耗' };
        }
        
        // TODO: 扣除材料和金币
        // TODO: 添加新卡牌
        
        return { success: true, result: recipe.resultCardId };
    }
    
    // 检查是否可以进化
    public canEvolve(
        cardId: string,
        cardLevel: number,
        cardAscension: number,
        cardAffinity: number
    ): {
        canEvolve: boolean;
        paths?: EvolutionPath[];
        error?: string;
    } {
        const paths = this.evolutionPaths.get(cardId);
        if (!paths || paths.length === 0) {
            return { canEvolve: false, error: '该卡牌无法进化' };
        }
        
        const availablePaths = paths.filter(p =>
            cardLevel >= p.requirements.level &&
            cardAscension >= p.requirements.ascension &&
            cardAffinity >= p.requirements.affinity
        );
        
        if (availablePaths.length === 0) {
            return { canEvolve: false, error: '未满足进化条件' };
        }
        
        return { canEvolve: true, paths: availablePaths };
    }
    
    // 执行进化
    public evolve(
        cardInstanceId: string,
        toCardId: string
    ): {
        success: boolean;
        newCardId?: string;
        error?: string;
    } {
        // TODO: 检查进化路径和材料
        // TODO: 执行进化逻辑
        
        return { success: true, newCardId: toCardId };
    }
    
    // 获取所有配方
    public getAllRecipes(): FusionRecipe[] {
        return Array.from(this.recipes.values());
    }
    
    // 获取可融合配方
    public getAvailableRecipes(playerCards: string[]): FusionRecipe[] {
        return this.getAllRecipes().filter(recipe => {
            const check = this.canFuse(playerCards, recipe.id);
            return check.canFuse;
        });
    }
    
    // 创建默认配方
    public createDefaultRecipes(): void {
        // 绿色+绿色=蓝色
        this.registerRecipe({
            id: 'fuse_green_to_blue',
            resultCardId: 'random_blue',
            ingredients: [
                { rarity: Rarity.GREEN, count: 3 }
            ],
            cost: { gold: 10000 },
            successRate: 80
        });
        
        // 蓝色+蓝色=紫色
        this.registerRecipe({
            id: 'fuse_blue_to_purple',
            resultCardId: 'random_purple',
            ingredients: [
                { rarity: Rarity.BLUE, count: 3 }
            ],
            cost: { gold: 50000 },
            successRate: 60
        });
        
        // 紫色+紫色=金色
        this.registerRecipe({
            id: 'fuse_purple_to_gold',
            resultCardId: 'random_gold',
            ingredients: [
                { rarity: Rarity.PURPLE, count: 3 }
            ],
            cost: { gold: 200000, materials: [{ itemId: 'fusion_stone', count: 10 }] },
            successRate: 40
        });
        
        // 同元素3张=更高品质同元素
        this.registerRecipe({
            id: 'fuse_same_element',
            resultCardId: 'random_same_element_higher',
            ingredients: [
                { element: 'same', count: 3 }
            ],
            cost: { gold: 50000 },
            successRate: 70
        });
    }
}

// 单例
export const fusionSystem = new FusionSystem();
