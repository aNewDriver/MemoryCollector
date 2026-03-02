/**
 * 爬塔系统
 * 无尽爬塔，每层难度递增
 */

import { _decorator, Component, Node, Label, ScrollView, Prefab, instantiate } from 'cc';
import { playerDataManager, TowerFloorData, RewardData } from '../data/PlayerData.ts';

const { ccclass, property } = _decorator;

@ccclass('TowerScene')
export class TowerScene extends Component {
    
    @property(Label)
    private currentFloorLabel: Label | null = null;
    
    @property(Label)
    private highestFloorLabel: Label | null = null;
    
    @property(Label)
    private todayProgressLabel: Label | null = null;
    
    @property(Node)
    private currentFloorNode: Node | null = null;
    
    @property(Node)
    private rewardPreviewNode: Node | null = null;
    
    @property(ScrollView)
    private floorListScrollView: ScrollView | null = null;
    
    @property(Prefab)
    private floorItemPrefab: Prefab | null = null;
    
    private currentFloor: number = 1;
    private highestFloor: number = 0;
    
    onEnable() {
        this.refreshData();
        this.updateUI();
    }
    
    private refreshData() {
        const player = playerDataManager.getPlayerData();
        this.highestFloor = player.highestTowerFloor;
        this.currentFloor = this.highestFloor + 1;
    }
    
    private updateUI() {
        this.currentFloorLabel!.string = `当前层数: ${this.currentFloor}`;
        this.highestFloorLabel!.string = `最高记录: ${this.highestFloor}`;
        
        // 显示当前层奖励预览
        const floorData = this.generateFloorData(this.currentFloor);
        this.showRewardPreview(floorData.rewards);
        
        // 生成附近楼层的列表（显示前后5层）
        this.generateFloorList();
    }
    
    private generateFloorData(floor: number): TowerFloorData {
        // 根据层数生成敌人配置
        const difficultyMultiplier = 1 + (floor - 1) * 0.05;  // 每层增加5%难度
        
        return {
            floor,
            name: `第${floor}层`,
            enemies: this.generateEnemies(floor, difficultyMultiplier),
            rewards: this.generateRewards(floor),
            specialRule: this.getSpecialRule(floor)
        };
    }
    
    private generateEnemies(floor: number, multiplier: number) {
        const enemyLevel = Math.floor(10 + floor * 0.5);
        
        // 每10层增加敌人数量
        const enemyCount = Math.min(3 + Math.floor(floor / 10), 5);
        
        const enemies = [];
        for (let i = 0; i < enemyCount; i++) {
            enemies.push({
                enemyId: `tower_enemy_${Math.floor(floor / 10)}`,
                level: enemyLevel,
                position: i
            });
        }
        
        return enemies;
    }
    
    private generateRewards(floor: number): RewardData {
        // 奖励随层数增加
        const baseExp = 200 + floor * 10;
        const baseGold = 1000 + floor * 50;
        
        const rewards: RewardData = {
            exp: baseExp,
            gold: baseGold
        };
        
        // 每5层额外奖励
        if (floor % 5 === 0) {
            rewards.materials = [
                { materialId: 'tower_token', count: Math.floor(floor / 5), chance: 100 }
            ];
        }
        
        // 每10层稀有奖励
        if (floor % 10 === 0) {
            rewards.cards = [{ cardId: 'random_rare', chance: 20 }];
        }
        
        return rewards;
    }
    
    private getSpecialRule(floor: number): string | undefined {
        // 特定楼层有特殊规则
        if (floor % 25 === 0) {
            return '敌人的所有属性提升50%';
        }
        if (floor % 50 === 0) {
            return '玩家能量恢复速度降低50%';
        }
        return undefined;
    }
    
    private showRewardPreview(rewards: RewardData) {
        // 显示奖励预览
        const expLabel = this.rewardPreviewNode?.getChildByName('Exp')?.getComponent(Label);
        const goldLabel = this.rewardPreviewNode?.getChildByName('Gold')?.getComponent(Label);
        
        if (expLabel) expLabel.string = `${rewards.exp}`;
        if (goldLabel) goldLabel.string = `${rewards.gold}`;
    }
    
    private generateFloorList() {
        if (!this.floorListScrollView || !this.floorItemPrefab) return;
        
        const content = this.floorListScrollView.content;
        content?.removeAllChildren();
        
        // 显示当前层附近±10层
        const startFloor = Math.max(1, this.currentFloor - 10);
        const endFloor = this.currentFloor + 10;
        
        for (let floor = endFloor; floor >= startFloor; floor--) {
            const node = instantiate(this.floorItemPrefab);
            this.setupFloorItem(node, floor);
            content?.addChild(node);
        }
    }
    
    private setupFloorItem(node: Node, floor: number) {
        const floorLabel = node.getChildByName('FloorNum')?.getComponent(Label);
        const statusLabel = node.getChildByName('Status')?.getComponent(Label);
        
        if (floorLabel) floorLabel.string = `第${floor}层`;
        
        let status = '';
        let canClick = false;
        
        if (floor <= this.highestFloor) {
            status = '已通关';
        } else if (floor === this.currentFloor) {
            status = '可挑战';
            canClick = true;
        } else {
            status = '未解锁';
        }
        
        if (statusLabel) statusLabel.string = status;
        
        if (canClick) {
            node.on(Node.EventType.TOUCH_END, () => {
                this.onFloorClick(floor);
            }, this);
        }
    }
    
    private onFloorClick(floor: number) {
        const floorData = this.generateFloorData(floor);
        
        // TODO: 打开战斗准备界面
        console.log(`准备挑战第${floor}层`);
        
        if (floorData.specialRule) {
            console.log(`特殊规则: ${floorData.specialRule}`);
        }
    }
    
    // 开始挑战当前层
    public onChallengeClick() {
        this.onFloorClick(this.currentFloor);
    }
    
    // 快速挑战（扫荡已通关层数）
    public onQuickChallengeClick() {
        // TODO: 扫荡功能，快速获得已通关层的奖励
    }
    
    // 记录通关
    public recordClear(floor: number) {
        if (floor > this.highestFloor) {
            this.highestFloor = floor;
            playerDataManager.getPlayerData().highestTowerFloor = floor;
            this.currentFloor = floor + 1;
            this.updateUI();
        }
    }
}
