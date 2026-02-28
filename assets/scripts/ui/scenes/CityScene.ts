/**
 * 主城场景
 * 包含功能性NPC、商店入口等
 */

import { _decorator, Component, Node, Label, animation } from 'cc';
import { GameScene, sceneManager } from '../core/SceneManager';
import { playerDataManager } from '../data/PlayerData';

const { ccclass, property } = _decorator;

@ccclass('CityScene')
export class CityScene extends Component {
    
    // 各个建筑/NPC节点
    @property(Node)
    private shopNode: Node | null = null;        // 商店
    
    @property(Node)
    private tavernNode: Node | null = null;      // 酒馆（抽卡）
    
    @property(Node)
    private forgeNode: Node | null = null;       // 铁匠铺（装备强化）
    
    @property(Node)
    private guildNode: Node | null = null;       // 公会
    
    @property(Node)
    private trainingNode: Node | null = null;    // 训练场（PVP）
    
    // 资源显示
    @property(Label)
    private goldLabel: Label | null = null;
    
    @property(Label)
    private crystalLabel: Label | null = null;
    
    @property(Label)
    private staminaLabel: Label | null = null;   // 体力
    
    private npcNodes: Map<string, Node> = new Map();
    
    onLoad() {
        this.registerNPCs();
    }
    
    onEnable() {
        this.refreshResourceDisplay();
        this.playIdleAnimations();
    }
    
    private registerNPCs() {
        this.npcNodes.set('shop', this.shopNode!);
        this.npcNodes.set('tavern', this.tavernNode!);
        this.npcNodes.set('forge', this.forgeNode!);
        this.npcNodes.set('guild', this.guildNode!);
        this.npcNodes.set('training', this.trainingNode!);
        
        // 注册点击事件
        this.npcNodes.forEach((node, key) => {
            if (node) {
                node.on(Node.EventType.TOUCH_END, () => {
                    this.onNPCClick(key);
                }, this);
            }
        });
    }
    
    private onNPCClick(npcType: string) {
        // 播放点击音效
        // audioManager.playSFX('npc_click');
        
        switch (npcType) {
            case 'shop':
                this.openShop();
                break;
            case 'tavern':
                this.openGacha();
                break;
            case 'forge':
                this.openForge();
                break;
            case 'guild':
                this.openGuild();
                break;
            case 'training':
                this.openPVP();
                break;
        }
    }
    
    private refreshResourceDisplay() {
        const player = playerDataManager.getPlayerData();
        this.goldLabel!.string = this.formatNumber(player.gold);
        this.crystalLabel!.string = this.formatNumber(player.soulCrystal);
        // this.staminaLabel!.string = `${player.stamina}/${player.maxStamina}`;
    }
    
    private formatNumber(num: number): string {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    private playIdleAnimations() {
        // 播放NPC待机动画
        this.npcNodes.forEach(node => {
            // 可以添加一些呼吸效果或浮动效果
        });
    }
    
    // ============ 各功能入口 ============
    
    private openShop() {
        console.log('打开商店');
        // UIManager.open('ShopPanel');
    }
    
    private openGacha() {
        console.log('打开酒馆（抽卡）');
        // UIManager.open('GachaPanel');
        
        // 直接切换到抽卡界面
        // sceneManager.switchTo(GameScene.GACHA, true);
    }
    
    private openForge() {
        console.log('打开铁匠铺');
        // UIManager.open('ForgePanel');
    }
    
    private openGuild() {
        console.log('打开公会');
        // UIManager.open('GuildPanel');
    }
    
    private openPVP() {
        console.log('打开训练场（PVP）');
        // UIManager.open('PVPPanel');
    }
    
    // 任务按钮
    public onQuestClick() {
        // UIManager.open('QuestPanel');
    }
    
    // 邮件按钮
    public onMailClick() {
        // UIManager.open('MailPanel');
    }
    
    // 背包按钮
    public onBagClick() {
        // UIManager.open('BagPanel');
    }
}
