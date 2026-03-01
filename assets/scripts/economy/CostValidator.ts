/**
 * 资源扣除验证器
 * 确保所有消耗操作都有足够的资源，防止负数
 */

import { logSystem } from '../log/LogSystem';

export enum CostValidationResult {
    SUCCESS = 'success',
    INSUFFICIENT_GOLD = 'insufficient_gold',
    INSUFFICIENT_CRYSTAL = 'insufficient_crystal',
    INSUFFICIENT_TICKET = 'insufficient_ticket',
    INSUFFICIENT_ITEM = 'insufficient_item',
    INSUFFICIENT_ENERGY = 'insufficient_energy',
    NEGATIVE_COST = 'negative_cost',
    SYSTEM_ERROR = 'system_error'
}

export interface CostCheck {
    gold?: number;
    soulCrystal?: number;
    energy?: number;
    items?: { itemId: string; count: number }[];
    tickets?: { type: string; count: number };
}

export class CostValidator {
    private static instance: CostValidator;
    private strictMode: boolean = true;  // 严格模式：不允许任何负数操作
    
    static getInstance(): CostValidator {
        if (!CostValidator.instance) {
            CostValidator.instance = new CostValidator();
        }
        return CostValidator.instance;
    }
    
    /**
     * 验证资源是否充足
     */
    public validateCost(
        playerId: string,
        currentResources: {
            gold: number;
            soulCrystal: number;
            energy: number;
            items: Map<string, number>;
            tickets: Map<string, number>;
        },
        cost: CostCheck
    ): {
        valid: boolean;
        result: CostValidationResult;
        missing?: string;
    } {
        // 1. 检查负数消耗
        if (this.hasNegativeCost(cost)) {
            logSystem.error('CostValidator', 'Negative cost detected', {
                playerId,
                cost
            });
            return { valid: false, result: CostValidationResult.NEGATIVE_COST };
        }
        
        // 2. 检查金币
        if (cost.gold !== undefined && cost.gold > 0) {
            if (currentResources.gold < cost.gold) {
                return {
                    valid: false,
                    result: CostValidationResult.INSUFFICIENT_GOLD,
                    missing: `需要 ${cost.gold} 金币，拥有 ${currentResources.gold}`
                };
            }
        }
        
        // 3. 检查魂晶
        if (cost.soulCrystal !== undefined && cost.soulCrystal > 0) {
            if (currentResources.soulCrystal < cost.soulCrystal) {
                return {
                    valid: false,
                    result: CostValidationResult.INSUFFICIENT_CRYSTAL,
                    missing: `需要 ${cost.soulCrystal} 魂晶，拥有 ${currentResources.soulCrystal}`
                };
            }
        }
        
        // 4. 检查体力
        if (cost.energy !== undefined && cost.energy > 0) {
            if (currentResources.energy < cost.energy) {
                return {
                    valid: false,
                    result: CostValidationResult.INSUFFICIENT_ENERGY,
                    missing: `需要 ${cost.energy} 体力，拥有 ${currentResources.energy}`
                };
            }
        }
        
        // 5. 检查道具
        if (cost.items) {
            for (const item of cost.items) {
                const hasCount = currentResources.items.get(item.itemId) || 0;
                if (hasCount < item.count) {
                    return {
                        valid: false,
                        result: CostValidationResult.INSUFFICIENT_ITEM,
                        missing: `需要 ${item.itemId} × ${item.count}，拥有 ${hasCount}`
                    };
                }
            }
        }
        
        // 6. 检查抽卡券
        if (cost.tickets) {
            const hasCount = currentResources.tickets.get(cost.tickets.type) || 0;
            if (hasCount < cost.tickets.count) {
                return {
                    valid: false,
                    result: CostValidationResult.INSUFFICIENT_TICKET,
                    missing: `需要 ${cost.tickets.type} × ${cost.tickets.count}，拥有 ${hasCount}`
                };
            }
        }
        
        return { valid: true, result: CostValidationResult.SUCCESS };
    }
    
    /**
     * 执行资源扣除（原子操作）
     */
    public deductCost(
        playerId: string,
        currentResources: {
            gold: number;
            soulCrystal: number;
            energy: number;
            items: Map<string, number>;
            tickets: Map<string, number>;
        },
        cost: CostCheck,
        operation: string
    ): {
        success: boolean;
        newResources?: typeof currentResources;
        error?: string;
    } {
        // 先验证
        const validation = this.validateCost(playerId, currentResources, cost);
        if (!validation.valid) {
            return {
                success: false,
                error: `资源不足: ${validation.missing}`
            };
        }
        
        try {
            // 创建新资源副本
            const newResources = {
                gold: currentResources.gold,
                soulCrystal: currentResources.soulCrystal,
                energy: currentResources.energy,
                items: new Map(currentResources.items),
                tickets: new Map(currentResources.tickets)
            };
            
            // 扣除金币
            if (cost.gold) {
                newResources.gold -= cost.gold;
                this.validateNonNegative(newResources.gold, 'gold');
            }
            
            // 扣除魂晶
            if (cost.soulCrystal) {
                newResources.soulCrystal -= cost.soulCrystal;
                this.validateNonNegative(newResources.soulCrystal, 'soulCrystal');
            }
            
            // 扣除体力
            if (cost.energy) {
                newResources.energy -= cost.energy;
                this.validateNonNegative(newResources.energy, 'energy');
            }
            
            // 扣除道具
            if (cost.items) {
                for (const item of cost.items) {
                    const current = newResources.items.get(item.itemId) || 0;
                    const newCount = current - item.count;
                    this.validateNonNegative(newCount, `item:${item.itemId}`);
                    newResources.items.set(item.itemId, newCount);
                }
            }
            
            // 扣除抽卡券
            if (cost.tickets) {
                const current = newResources.tickets.get(cost.tickets.type) || 0;
                const newCount = current - cost.tickets.count;
                this.validateNonNegative(newCount, `ticket:${cost.tickets.type}`);
                newResources.tickets.set(cost.tickets.type, newCount);
            }
            
            // 记录日志
            logSystem.info('CostValidator', `Cost deducted: ${operation}`, {
                playerId,
                cost,
                remaining: {
                    gold: newResources.gold,
                    soulCrystal: newResources.soulCrystal,
                    energy: newResources.energy
                }
            });
            
            return { success: true, newResources };
        } catch (error) {
            logSystem.error('CostValidator', 'Deduct failed', { playerId, cost, error });
            return { success: false, error: '扣除失败' };
        }
    }
    
    /**
     * 特定系统：抽卡消耗验证
     */
    public validateGachaCost(
        playerId: string,
        resources: any,
        isTenPull: boolean,
        hasTicket: boolean
    ): { valid: boolean; cost: CostCheck; error?: string } {
        const cost: CostCheck = isTenPull
            ? (hasTicket ? { tickets: { type: 'gacha_ticket_10', count: 1 } } : { soulCrystal: 2800 })
            : (hasTicket ? { tickets: { type: 'gacha_ticket', count: 1 } } : { soulCrystal: 280 });
        
        const validation = this.validateCost(playerId, resources, cost);
        return {
            valid: validation.valid,
            cost,
            error: validation.missing
        };
    }
    
    /**
     * 特定系统：转盘消耗验证
     */
    public validateRouletteCost(
        playerId: string,
        resources: any,
        isFree: boolean
    ): { valid: boolean; cost: CostCheck; error?: string } {
        if (isFree) {
            return { valid: true, cost: {} };
        }
        
        const cost: CostCheck = { soulCrystal: 50 };
        const validation = this.validateCost(playerId, resources, cost);
        return {
            valid: validation.valid,
            cost,
            error: validation.missing
        };
    }
    
    /**
     * 特定系统：商店购买验证
     */
    public validateShopPurchase(
        playerId: string,
        resources: any,
        price: { currency: string; amount: number }
    ): { valid: boolean; cost: CostCheck; error?: string } {
        const cost: CostCheck = {};
        
        switch (price.currency) {
            case 'gold':
                cost.gold = price.amount;
                break;
            case 'soul_crystal':
                cost.soulCrystal = price.amount;
                break;
            default:
                // 特殊货币作为道具处理
                cost.items = [{ itemId: price.currency, count: price.amount }];
        }
        
        const validation = this.validateCost(playerId, resources, cost);
        return {
            valid: validation.valid,
            cost,
            error: validation.missing
        };
    }
    
    /**
     * 特定系统：战斗体力消耗验证
     */
    public validateBattleEnergy(
        playerId: string,
        resources: any,
        stageId: string
    ): { valid: boolean; cost: CostCheck; error?: string } {
        // 根据关卡计算体力消耗
        let energyCost = 6;  // 基础消耗
        
        // Boss关消耗更多
        if (stageId.includes('boss')) {
            energyCost = 12;
        }
        
        const cost: CostCheck = { energy: energyCost };
        const validation = this.validateCost(playerId, resources, cost);
        return {
            valid: validation.valid,
            cost,
            error: validation.missing
        };
    }
    
    /**
     * 检查是否有负数消耗
     */
    private hasNegativeCost(cost: CostCheck): boolean {
        if (cost.gold !== undefined && cost.gold < 0) return true;
        if (cost.soulCrystal !== undefined && cost.soulCrystal < 0) return true;
        if (cost.energy !== undefined && cost.energy < 0) return true;
        
        if (cost.items) {
            for (const item of cost.items) {
                if (item.count < 0) return true;
            }
        }
        
        if (cost.tickets && cost.tickets.count < 0) return true;
        
        return false;
    }
    
    /**
     * 验证非负
     */
    private validateNonNegative(value: number, name: string): void {
        if (this.strictMode && value < 0) {
            throw new Error(`Negative value detected: ${name} = ${value}`);
        }
    }
    
    /**
     * 设置严格模式
     */
    public setStrictMode(enabled: boolean): void {
        this.strictMode = enabled;
        logSystem.info('CostValidator', `Strict mode ${enabled ? 'enabled' : 'disabled'}`);
    }
}

// 单例导出
export const costValidator = CostValidator.getInstance();
