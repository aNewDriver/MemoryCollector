/**
 * 音效管理器
 * 背景音乐和音效控制
 */

export enum SoundType {
    BGM = 'bgm',           // 背景音乐
    SFX = 'sfx',           // 音效
    UI = 'ui',             // UI音效
    VOICE = 'voice'        // 语音
}

export enum BGMTrack {
    MAIN_THEME = 'main_theme',
    CITY = 'city',
    BATTLE = 'battle',
    BOSS = 'boss',
    VICTORY = 'victory',
    DEFEAT = 'defeat'
}

export enum SFXType {
    // UI音效
    BUTTON_CLICK = 'button_click',
    PANEL_OPEN = 'panel_open',
    PANEL_CLOSE = 'panel_close',
    TAB_SWITCH = 'tab_switch',
    
    // 战斗音效
    ATTACK_NORMAL = 'attack_normal',
    ATTACK_HEAVY = 'attack_heavy',
    SKILL_CAST = 'skill_cast',
    DAMAGE_HIT = 'damage_hit',
    DAMAGE_CRIT = 'damage_crit',
    HEAL = 'heal',
    BUFF_APPLY = 'buff_apply',
    DEBUFF_APPLY = 'debuff_apply',
    BATTLE_START = 'battle_start',
    BATTLE_WIN = 'battle_win',
    BATTLE_LOSE = 'battle_lose',
    
    // 养成音效
    LEVEL_UP = 'level_up',
    ASCENSION = 'ascension',
    AWAKEN = 'awaken',
    EQUIP = 'equip',
    EQUIP_UPGRADE = 'equip_upgrade',
    
    // 抽卡音效
    GACHA_PULL = 'gacha_pull',
    GACHA_RARE = 'gacha_rare',
    GACHA_EPIC = 'gacha_epic',
    GACHA_LEGEND = 'gacha_legend',
    
    // 获得奖励
    REWARD_COMMON = 'reward_common',
    REWARD_RARE = 'reward_rare',
    ITEM_GET = 'item_get'
}

// 音频资源配置
export const AUDIO_RESOURCES = {
    [BGMTrack.MAIN_THEME]: 'audio/bgm/main_theme',
    [BGMTrack.CITY]: 'audio/bgm/city',
    [BGMTrack.BATTLE]: 'audio/bgm/battle',
    [BGMTrack.BOSS]: 'audio/bgm/boss',
    [BGMTrack.VICTORY]: 'audio/bgm/victory',
    [BGMTrack.DEFEAT]: 'audio/bgm/defeat',
    
    [SFXType.BUTTON_CLICK]: 'audio/sfx/ui/button_click',
    [SFXType.PANEL_OPEN]: 'audio/sfx/ui/panel_open',
    [SFXType.PANEL_CLOSE]: 'audio/sfx/ui/panel_close',
    [SFXType.TAB_SWITCH]: 'audio/sfx/ui/tab_switch',
    
    [SFXType.ATTACK_NORMAL]: 'audio/sfx/battle/attack_normal',
    [SFXType.ATTACK_HEAVY]: 'audio/sfx/battle/attack_heavy',
    [SFXType.SKILL_CAST]: 'audio/sfx/battle/skill_cast',
    [SFXType.DAMAGE_HIT]: 'audio/sfx/battle/damage_hit',
    [SFXType.DAMAGE_CRIT]: 'audio/sfx/battle/damage_crit',
    [SFXType.HEAL]: 'audio/sfx/battle/heal',
    [SFXType.BUFF_APPLY]: 'audio/sfx/battle/buff_apply',
    [SFXType.BATTLE_START]: 'audio/sfx/battle/battle_start',
    [SFXType.BATTLE_WIN]: 'audio/sfx/battle/battle_win',
    [SFXType.BATTLE_LOSE]: 'audio/sfx/battle/battle_lose',
    
    [SFXType.LEVEL_UP]: 'audio/sfx/growth/level_up',
    [SFXType.ASCENSION]: 'audio/sfx/growth/ascension',
    [SFXType.AWAKEN]: 'audio/sfx/growth/awaken',
    [SFXType.EQUIP]: 'audio/sfx/growth/equip',
    
    [SFXType.GACHA_PULL]: 'audio/sfx/gacha/gacha_pull',
    [SFXType.GACHA_RARE]: 'audio/sfx/gacha/gacha_rare',
    [SFXType.GACHA_EPIC]: 'audio/sfx/gacha/gacha_epic',
    [SFXType.GACHA_LEGEND]: 'audio/sfx/gacha/gacha_legend',
    
    [SFXType.REWARD_COMMON]: 'audio/sfx/reward/common',
    [SFXType.REWARD_RARE]: 'audio/sfx/reward/rare',
    [SFXType.ITEM_GET]: 'audio/sfx/reward/item_get'
};

export class AudioManager {
    private bgmVolume: number = 0.7;
    private sfxVolume: number = 0.8;
    private isMuted: boolean = false;
    private isVibrationEnabled: boolean = true;
    
    private currentBGM: string | null = null;
    private audioCache: Map<string, any> = new Map();
    
    // 设置音量
    public setBGMVolume(volume: number): void {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        // TODO: 应用音量到当前播放的BGM
    }
    
    public setSFXVolume(volume: number): void {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
    
    public getBGMVolume(): number {
        return this.bgmVolume;
    }
    
    public getSFXVolume(): number {
        return this.sfxVolume;
    }
    
    // 静音切换
    public toggleMute(): boolean {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }
    
    public isAudioMuted(): boolean {
        return this.isMuted;
    }
    
    // 震动设置
    public setVibrationEnabled(enabled: boolean): void {
        this.isVibrationEnabled = enabled;
    }
    
    public isVibrationOn(): boolean {
        return this.isVibrationEnabled;
    }
    
    // 播放背景音乐
    public playBGM(track: BGMTrack, fadeDuration: number = 1.0): void {
        if (this.isMuted) return;
        
        const path = AUDIO_RESOURCES[track];
        if (!path) return;
        
        // TODO: 使用Cocos音频引擎播放
        // 如果当前有BGM，先淡出
        // 然后播放新BGM，淡入
        
        this.currentBGM = track;
        console.log(`播放BGM: ${track}`);
    }
    
    // 停止BGM
    public stopBGM(fadeDuration: number = 1.0): void {
        // TODO: 淡出停止
        this.currentBGM = null;
    }
    
    // 播放音效
    public playSFX(sfx: SFXType): void {
        if (this.isMuted) return;
        
        const path = AUDIO_RESOURCES[sfx];
        if (!path) return;
        
        // TODO: 使用Cocos音频引擎播放
        console.log(`播放音效: ${sfx}`);
        
        // 震动反馈（特定音效）
        if (this.isVibrationEnabled) {
            this.triggerVibration(sfx);
        }
    }
    
    // 播放UI音效
    public playUI(uiSound: SFXType.BUTTON_CLICK | SFXType.PANEL_OPEN | SFXType.PANEL_CLOSE): void {
        this.playSFX(uiSound);
    }
    
    // 播放战斗音效
    public playBattleSFX(sfx: SFXType): void {
        this.playSFX(sfx);
    }
    
    // 播放抽卡音效（根据稀有度）
    public playGachaSFX(rarity: number): void {
        switch (rarity) {
            case 4: // 传说
                this.playSFX(SFXType.GACHA_LEGEND);
                break;
            case 3: // 史诗
                this.playSFX(SFXType.GACHA_EPIC);
                break;
            case 2: // 稀有
                this.playSFX(SFXType.GACHA_RARE);
                break;
            default:
                this.playSFX(SFXType.GACHA_PULL);
        }
    }
    
    // 播放胜利/失败音效
    public playBattleResult(win: boolean): void {
        this.playSFX(win ? SFXType.BATTLE_WIN : SFXType.BATTLE_LOSE);
        this.playBGM(win ? BGMTrack.VICTORY : BGMTrack.DEFEAT, 0.5);
    }
    
    // 震动反馈
    private triggerVibration(sfx: SFXType): void {
        // 只在特定音效触发震动
        const vibrationSounds = [
            SFXType.DAMAGE_HIT,
            SFXType.DAMAGE_CRIT,
            SFXType.BATTLE_WIN,
            SFXType.BATTLE_LOSE,
            SFXType.GACHA_LEGEND,
            SFXType.AWAKEN
        ];
        
        if (vibrationSounds.includes(sfx)) {
            // TODO: 调用设备震动API
            // if (sys.platform === sys.Platform.MOBILE_BROWSER || sys.isNative) {
            //     navigator.vibrate?.(sfx === SFXType.DAMAGE_CRIT ? 100 : 50);
            // }
        }
    }
    
    // 预加载音频
    public preloadAudio(keys: (BGMTrack | SFXType)[]): void {
        // TODO: 批量预加载音频资源
    }
    
    // 卸载音频
    public unloadAudio(key: string): void {
        this.audioCache.delete(key);
    }
    
    // 暂停所有音频（后台切换时）
    public pauseAll(): void {
        // TODO: 暂停所有正在播放的音频
    }
    
    // 恢复所有音频
    public resumeAll(): void {
        if (this.isMuted) return;
        // TODO: 恢复音频播放
    }
}

// 单例
export const audioManager = new AudioManager();
