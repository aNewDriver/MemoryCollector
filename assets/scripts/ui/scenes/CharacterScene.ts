/**
 * 角色界面控制器
 * 显示主角信息、装备、属性
 */

import { _decorator, Component, Node, Label, Sprite } from 'cc';
import { PlayerData, playerDataManager } from '../../data/PlayerData.ts';
import { CardInstance } from '../../data/CardData.ts';

const { ccclass, property } = _decorator;

@ccclass('CharacterScene')
export class CharacterScene extends Component {
    
    // 主角头像
    @property(Sprite)
    private avatarSprite: Sprite | null = null;
    
    // 玩家信息
    @property(Label)
    private nameLabel: Label | null = null;
    
    @property(Label)
    private levelLabel: Label | null = null;
    
    @property(Label)
    private expLabel: Label | null = null;
    
    // 战斗属性
    @property(Label)
    private hpLabel: Label | null = null;
    
    @property(Label)
    private atkLabel: Label | null = null;
    
    @property(Label)
    private defLabel: Label | null = null;
    
    @property(Label)
    private spdLabel: Label | null = null;
    
    // 装备槽位（6个）
    @property([Node])
    private equipmentSlots: Node[] = [];
    
    // 当前展示的卡牌
    private currentCard: CardInstance | null = null;
    
    onEnable() {
        this.refreshUI();
    }
    
    private refreshUI() {
        const player = playerDataManager.getPlayerData();
        
        // 基础信息
        this.nameLabel!.string = player.name;
        this.levelLabel!.string = `Lv.${player.level}`;
        this.expLabel!.string = `${player.exp}/${player.getExpToNextLevel()}`;
        
        // 获取当前主力卡牌（或主角本身）
        const mainCard = playerDataManager.getMainCard();
        if (mainCard) {
            this.currentCard = mainCard;
            this.updateStats(mainCard);
            this.updateEquipment(mainCard);
        }
    }
    
    private updateStats(card: CardInstance) {
        const stats = card.currentStats;
        this.hpLabel!.string = `${stats.hp}`;
        this.atkLabel!.string = `${stats.atk}`;
        this.defLabel!.string = `${stats.def}`;
        this.spdLabel!.string = `${stats.spd}`;
    }
    
    private updateEquipment(card: CardInstance) {
        card.equipments.forEach((equipmentId, index) => {
            if (index < this.equipmentSlots.length) {
                const slot = this.equipmentSlots[index];
                if (equipmentId) {
                    // 显示装备
                    this.showEquipmentInSlot(slot, equipmentId);
                } else {
                    // 显示空槽位
                    this.showEmptySlot(slot, index);
                }
            }
        });
    }
    
    private showEquipmentInSlot(slot: Node, equipmentId: string) {
        // TODO: 根据装备ID显示装备图标和信息
    }
    
    private showEmptySlot(slot: Node, slotIndex: number) {
        // TODO: 显示空槽位提示
        const slotNames = ['武器', '头盔', '护甲', '护腿', '饰品', '戒指'];
        // slot.getComponent(Label)!.string = slotNames[slotIndex];
    }
    
    // 切换显示的角色
    public onSwitchCharacterClick() {
        // 打开角色选择界面
        // UIManager.open('CharacterSelect');
    }
    
    // 装备点击
    public onEquipmentClick(slotIndex: number) {
        if (this.currentCard?.equipments[slotIndex]) {
            // 显示装备详情，可以卸下
        } else {
            // 打开装备选择界面
        }
    }
}
