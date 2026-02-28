/**
 * 弹窗管理器
 * 统一管理弹窗的显示和关闭
 */

import { _decorator, Component, Node, instantiate, Prefab, director } from 'cc';

const { ccclass, property } = _decorator;

export enum PopupType {
    ALERT = 'alert',           // 提示弹窗
    CONFIRM = 'confirm',       // 确认弹窗
    REWARD = 'reward',         // 奖励弹窗
    LOADING = 'loading',       // 加载弹窗
    TOAST = 'toast'            // 轻提示
}

interface PopupConfig {
    title?: string;
    content: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

@ccclass('PopupManager')
export class PopupManager extends Component {
    
    @property(Prefab)
    private alertPrefab: Prefab | null = null;
    
    @property(Prefab)
    private confirmPrefab: Prefab | null = null;
    
    @property(Prefab)
    private rewardPrefab: Prefab | null = null;
    
    @property(Prefab)
    private loadingPrefab: Prefab | null = null;
    
    @property(Prefab)
    private toastPrefab: Prefab | null = null;
    
    @property(Node)
    private popupContainer: Node | null = null;
    
    private static _instance: PopupManager | null = null;
    public static get instance(): PopupManager {
        return PopupManager._instance!;
    }
    
    private popupStack: Node[] = [];
    
    onLoad() {
        if (PopupManager._instance) {
            this.destroy();
            return;
        }
        PopupManager._instance = this;
        director.addPersistRootNode(this.node);
    }
    
    // ============ 提示弹窗 ============
    
    public showAlert(config: PopupConfig) {
        if (!this.alertPrefab || !this.popupContainer) return;
        
        const popup = instantiate(this.alertPrefab);
        this.setupPopup(popup, config);
        this.showPopup(popup);
    }
    
    // ============ 确认弹窗 ============
    
    public showConfirm(config: PopupConfig) {
        if (!this.confirmPrefab || !this.popupContainer) return;
        
        const popup = instantiate(this.confirmPrefab);
        this.setupPopup(popup, config);
        this.showPopup(popup);
    }
    
    // ============ 奖励弹窗 ============
    
    public showReward(rewards: { type: string; count: number; icon?: string }[]) {
        if (!this.rewardPrefab || !this.popupContainer) return;
        
        const popup = instantiate(this.rewardPrefab);
        // TODO: 设置奖励内容
        this.showPopup(popup);
    }
    
    // ============ 加载弹窗 ============
    
    private loadingPopup: Node | null = null;
    
    public showLoading(text: string = '加载中...') {
        if (this.loadingPopup) return;
        
        if (!this.loadingPrefab || !this.popupContainer) return;
        
        this.loadingPopup = instantiate(this.loadingPrefab);
        // TODO: 设置加载文本
        this.popupContainer.addChild(this.loadingPopup);
    }
    
    public hideLoading() {
        if (this.loadingPopup) {
            this.loadingPopup.destroy();
            this.loadingPopup = null;
        }
    }
    
    // ============ Toast 提示 ============
    
    public showToast(message: string, duration: number = 2) {
        if (!this.toastPrefab || !this.popupContainer) return;
        
        const toast = instantiate(this.toastPrefab);
        // TODO: 设置消息文本
        this.popupContainer.addChild(toast);
        
        // 自动消失
        setTimeout(() => {
            toast.destroy();
        }, duration * 1000);
    }
    
    // ============ 私有方法 ============
    
    private setupPopup(popup: Node, config: PopupConfig) {
        // 设置标题
        const titleLabel = popup.getChildByName('Title')?.getComponent('cc.Label');
        if (titleLabel && config.title) {
            // titleLabel.string = config.title;
        }
        
        // 设置内容
        const contentLabel = popup.getChildByName('Content')?.getComponent('cc.Label');
        if (contentLabel) {
            // contentLabel.string = config.content;
        }
        
        // 设置按钮
        const confirmBtn = popup.getChildByName('ConfirmBtn');
        if (confirmBtn && config.onConfirm) {
            confirmBtn.on(Node.EventType.TOUCH_END, () => {
                this.closePopup(popup);
                config.onConfirm!();
            });
        }
        
        const cancelBtn = popup.getChildByName('CancelBtn');
        if (cancelBtn && config.onCancel) {
            cancelBtn.on(Node.EventType.TOUCH_END, () => {
                this.closePopup(popup);
                config.onCancel!();
            });
        }
    }
    
    private showPopup(popup: Node) {
        this.popupContainer!.addChild(popup);
        this.popupStack.push(popup);
        
        // 入场动画
        popup.setScale(0.8);
        popup.opacity = 0;
        
        // TODO: 使用 tween 播放动画
        // cc.tween(popup)
        //     .to(0.2, { scale: 1, opacity: 255 })
        //     .start();
    }
    
    private closePopup(popup: Node) {
        const index = this.popupStack.indexOf(popup);
        if (index > -1) {
            this.popupStack.splice(index, 1);
        }
        
        // 退场动画
        // cc.tween(popup)
        //     .to(0.2, { scale: 0.8, opacity: 0 })
        //     .call(() => popup.destroy())
        //     .start();
        
        popup.destroy();
    }
    
    // 关闭所有弹窗
    public closeAllPopups() {
        while (this.popupStack.length > 0) {
            const popup = this.popupStack.pop();
            if (popup) {
                popup.destroy();
            }
        }
        this.hideLoading();
    }
}
