/**
 * 卡牌展示组件
 * 显示卡牌头像、名称、稀有度等
 */

import { _decorator, Component, Node, Label, Sprite, Color, sp } from 'cc';
import { CardData, CardInstance, Rarity, ElementType, getCardData } from '../../data/CardData';

const { ccclass, property } = _decorator;

// 稀有度颜色
const RARITY_COLORS: { [key in Rarity]: Color } = {
    [Rarity.COMMON]: new Color(169, 169, 169),    // 灰
    [Rarity.RARE]: new Color(65, 105, 225),       // 蓝
    [Rarity.EPIC]: new Color(147, 0, 211),        // 紫
    [Rarity.LEGEND]: new Color(255, 215, 0),      // 金
    [Rarity.MYTH]: new Color(220, 20, 60)         // 红
};

// 元素图标路径
const ELEMENT_ICONS: { [key in ElementType]: string } = {
    [ElementType.FIRE]: 'icons/element_fire',
    [ElementType.WATER]: 'icons/element_water',
    [ElementType.WIND]: 'icons/element_wind',
    [ElementType.EARTH]: 'icons/element_earth',
    [ElementType.LIGHT]: 'icons/element_light',
    [ElementType.DARK]: 'icons/element_dark'
};

@ccclass('CardDisplay')
export class CardDisplay extends Component {
    
    @property(Sprite)
    private portraitSprite: Sprite | null = null;
    
    @property(Sprite)
    private frameSprite: Sprite | null = null;
    
    @property(Sprite)
    private elementIcon: Sprite | null = null;
    
    @property(Label)
    private nameLabel: Label | null = null;
    
    @property(Label)
    private titleLabel: Label | null = null;
    
    @property(Label)
    private levelLabel: Label | null = null;
    
    @property(Node)
    private starsContainer: Node | null = null;
    
    @property(Node)
    private awakenBadge: Node | null = null;
    
    private cardData: CardData | null = null;
    private cardInstance: CardInstance | null = null;
    
    // 显示卡牌配置数据（未获得）
    public setCardData(cardId: string) {
        const data = getCardData(cardId);
        if (!data) return;
        
        this.cardData = data;
        this.cardInstance = null;
        
        this.updateDisplay();
    }
    
    // 显示玩家拥有的卡牌实例
    public setCardInstance(instance: CardInstance) {
        const data = getCardData(instance.cardId);
        if (!data) return;
        
        this.cardData = data;
        this.cardInstance = instance;
        
        this.updateDisplay();
        this.updateInstanceInfo();
    }
    
    private updateDisplay() {
        if (!this.cardData) return;
        
        // 名称
        if (this.nameLabel) {
            this.nameLabel.string = this.cardData.name;
        }
        
        // 称号
        if (this.titleLabel) {
            this.titleLabel.string = this.cardData.title;
        }
        
        // 稀有度边框颜色
        if (this.frameSprite) {
            this.frameSprite.color = RARITY_COLORS[this.cardData.rarity];
        }
        
        // 元素图标
        // TODO: 加载元素图标 SpriteFrame
        // if (this.elementIcon) {
        //     this.elementIcon.spriteFrame = await loadSpriteFrame(ELEMENT_ICONS[this.cardData.element]);
        // }
        
        // 立绘
        // TODO: 加载卡牌立绘
        // if (this.portraitSprite) {
        //     this.portraitSprite.spriteFrame = await loadSpriteFrame(this.cardData.art.portrait);
        // }
    }
    
    private updateInstanceInfo() {
        if (!this.cardInstance) return;
        
        // 等级
        if (this.levelLabel) {
            this.levelLabel.string = `Lv.${this.cardInstance.level}`;
        }
        
        // 觉醒标记
        if (this.awakenBadge) {
            this.awakenBadge.active = this.cardInstance.awakened;
        }
        
        // 星级（突破次数）
        this.updateStars(this.cardInstance.ascension);
    }
    
    private updateStars(starCount: number) {
        if (!this.starsContainer) return;
        
        // 显示/隐藏星星
        for (let i = 0; i < 5; i++) {
            const star = this.starsContainer.children[i];
            if (star) {
                star.active = i < starCount;
            }
        }
    }
    
    // 显示选中效果
    public setSelected(selected: boolean) {
        if (selected) {
            this.node.setScale(1.1);
            // TODO: 添加选中光环效果
        } else {
            this.node.setScale(1);
        }
    }
    
    // 点击回调
    private onClick() {
        // TODO: 触发点击事件
        // eventManager.emit(GameEvent.CARD_CLICKED, this.cardData?.id);
    }
}
