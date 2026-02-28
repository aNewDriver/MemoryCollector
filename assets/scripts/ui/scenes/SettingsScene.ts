/**
 * 设置场景
 * 游戏基础设置
 */

import { _decorator, Component, Node, Slider, Toggle, Label } from 'cc';
import { playerDataManager } from '../data/PlayerData';

const { ccclass, property } = _decorator;

@ccclass('SettingsScene')
export class SettingsScene extends Component {
    
    // 音量设置
    @property(Slider)
    private bgmSlider: Slider | null = null;
    
    @property(Label)
    private bgmValueLabel: Label | null = null;
    
    @property(Slider)
    private sfxSlider: Slider | null = null;
    
    @property(Label)
    private sfxValueLabel: Label | null = null;
    
    // 功能开关
    @property(Toggle)
    private vibrationToggle: Toggle | null = null;
    
    @property(Toggle)
    private notificationToggle: Toggle | null = null;
    
    // 信息展示
    @property(Label)
    private versionLabel: Label | null = null;
    
    @property(Label)
    private playerIdLabel: Label | null = null;
    
    onEnable() {
        this.loadSettings();
    }
    
    private loadSettings() {
        const settings = playerDataManager.getPlayerData().settings;
        
        // 设置滑块值
        if (this.bgmSlider) {
            this.bgmSlider.progress = settings.bgmVolume;
            this.updateBGMLabel(settings.bgmVolume);
        }
        
        if (this.sfxSlider) {
            this.sfxSlider.progress = settings.sfxVolume;
            this.updateSFXLabel(settings.sfxVolume);
        }
        
        // 设置开关
        if (this.vibrationToggle) {
            this.vibrationToggle.isChecked = settings.vibration;
        }
        
        if (this.notificationToggle) {
            this.notificationToggle.isChecked = settings.notifications;
        }
        
        // 版本信息
        this.versionLabel!.string = '版本: 1.0.0';
        this.playerIdLabel!.string = `ID: ${this.generatePlayerId()}`;
    }
    
    private generatePlayerId(): string {
        // 生成或获取玩家唯一ID
        let playerId = localStorage.getItem('player_id');
        if (!playerId) {
            playerId = 'MC' + Date.now().toString(36).toUpperCase();
            localStorage.setItem('player_id', playerId);
        }
        return playerId;
    }
    
    // ============ 事件处理 ============
    
    public onBGMSliderChange(slider: Slider) {
        const value = Math.floor(slider.progress * 100);
        this.updateBGMLabel(slider.progress);
        
        // 保存设置
        playerDataManager.getPlayerData().settings.bgmVolume = slider.progress;
        
        // 应用音量
        // audioManager.setBGMVolume(slider.progress);
    }
    
    private updateBGMLabel(value: number) {
        if (this.bgmValueLabel) {
            this.bgmValueLabel.string = `${Math.floor(value * 100)}%`;
        }
    }
    
    public onSFXSliderChange(slider: Slider) {
        const value = Math.floor(slider.progress * 100);
        this.updateSFXLabel(slider.progress);
        
        playerDataManager.getPlayerData().settings.sfxVolume = slider.progress;
        
        // 播放测试音效
        // audioManager.setSFXVolume(slider.progress);
        // audioManager.playSFX('test');
    }
    
    private updateSFXLabel(value: number) {
        if (this.sfxValueLabel) {
            this.sfxValueLabel.string = `${Math.floor(value * 100)}%`;
        }
    }
    
    public onVibrationToggle(toggle: Toggle) {
        playerDataManager.getPlayerData().settings.vibration = toggle.isChecked;
        
        if (toggle.isChecked) {
            // 测试震动
            // if (sys.platform === sys.Platform.MOBILE_BROWSER || sys.isNative) {
            //     navigator.vibrate?.(100);
            // }
        }
    }
    
    public onNotificationToggle(toggle: Toggle) {
        playerDataManager.getPlayerData().settings.notifications = toggle.isChecked;
    }
    
    // ============ 功能按钮 ============
    
    // 兑换码
    public onRedeemCodeClick() {
        // UIManager.open('RedeemCodePanel');
    }
    
    // 联系客服
    public onCustomerServiceClick() {
        // 打开客服链接或面板
        // sys.openURL('https://support.example.com');
    }
    
    // 隐私政策
    public onPrivacyPolicyClick() {
        // sys.openURL('https://privacy.example.com');
    }
    
    // 用户协议
    public onUserAgreementClick() {
        // sys.openURL('https://terms.example.com');
    }
    
    // 清除缓存
    public onClearCacheClick() {
        // UIManager.showConfirm('确定要清除缓存吗？', () => {
        //     localStorage.clear();
        //     // 重新加载游戏
        // });
    }
    
    // 退出登录
    public onLogoutClick() {
        // UIManager.showConfirm('确定要退出登录吗？', () => {
        //     // 清除登录状态
        //     // 返回登录界面
        // });
    }
    
    // 保存设置
    public saveSettings() {
        playerDataManager.save();
    }
}
