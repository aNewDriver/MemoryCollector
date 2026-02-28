/**
 * 通用按钮组件
 * 支持点击音效、禁用状态、长按检测
 */

import { _decorator, Component, Node, Label, Sprite, EventTouch, AudioClip } from 'cc';
import { audioManager, SFXType } from '../../audio/AudioManager';

const { ccclass, property } = _decorator;

export enum ButtonStyle {
    PRIMARY = 'primary',      // 主按钮（金色）
    SECONDARY = 'secondary',  // 次按钮（蓝色）
    DANGER = 'danger',        // 危险（红色）
    GHOST = 'ghost'           // 幽灵（透明）
}

@ccclass('CommonButton')
export class CommonButton extends Component {
    
    @property(Label)
    private label: Label | null = null;
    
    @property(Sprite)
    private bgSprite: Sprite | null = null;
    
    @property
    private buttonText: string = 'Button';
    
    @property
    private style: ButtonStyle = ButtonStyle.PRIMARY;
    
    @property
    private playSound: boolean = true;
    
    @property
    private soundType: SFXType = SFXType.BUTTON_CLICK;
    
    @property
    private enableLongPress: boolean = false;
    
    @property
    private longPressDuration: number = 0.5;  // 秒
    
    private isPressed: boolean = false;
    private longPressTimer: any = null;
    private isDisabled: boolean = false;
    
    // 回调函数
    private clickCallback: (() => void) | null = null;
    private longPressCallback: (() => void) | null = null;
    
    onLoad() {
        this.updateLabel();
        this.registerEvents();
    }
    
    private updateLabel() {
        if (this.label) {
            this.label.string = this.buttonText;
        }
    }
    
    private registerEvents() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }
    
    private onTouchStart(event: EventTouch) {
        if (this.isDisabled) return;
        
        this.isPressed = true;
        this.node.setScale(0.95);
        
        // 长按检测
        if (this.enableLongPress) {
            this.longPressTimer = setTimeout(() => {
                if (this.isPressed && this.longPressCallback) {
                    this.longPressCallback();
                    this.isPressed = false;
                }
            }, this.longPressDuration * 1000);
        }
    }
    
    private onTouchEnd(event: EventTouch) {
        if (this.isDisabled) return;
        
        this.node.setScale(1);
        
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
        
        if (this.isPressed) {
            this.isPressed = false;
            
            // 播放音效
            if (this.playSound) {
                audioManager.playSFX(this.soundType);
            }
            
            // 触发回调
            if (this.clickCallback) {
                this.clickCallback();
            }
        }
    }
    
    private onTouchCancel(event: EventTouch) {
        this.isPressed = false;
        this.node.setScale(1);
        
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
    }
    
    // ============ 公共接口 ============
    
    public setText(text: string) {
        this.buttonText = text;
        this.updateLabel();
    }
    
    public setClickCallback(callback: () => void) {
        this.clickCallback = callback;
    }
    
    public setLongPressCallback(callback: () => void) {
        this.longPressCallback = callback;
    }
    
    public setDisabled(disabled: boolean) {
        this.isDisabled = disabled;
        
        if (this.bgSprite) {
            this.bgSprite.grayscale = disabled;
        }
        
        // 禁用交互
        this.node.getComponent('cc.Button')!.enabled = !disabled;
    }
    
    public setStyle(style: ButtonStyle) {
        this.style = style;
        // TODO: 切换按钮样式（更换SpriteFrame）
    }
    
    onDestroy() {
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
        }
        
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }
}
