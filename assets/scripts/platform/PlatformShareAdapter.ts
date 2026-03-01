/**
 * 平台分享适配器
 * 微信小游戏/QQ/抖音/快手等多平台分享
 */

export enum PlatformType {
    WECHAT = 'wechat',       // 微信小游戏
    QQ = 'qq',               // QQ小游戏
    DOUYIN = 'douyin',       // 抖音小游戏
    KUAISHOU = 'kuaishou',   // 快手小游戏
    OPPO = 'oppo',           // OPPO小游戏
    VIVO = 'vivo',           // VIVO小游戏
    BAIDU = 'baidu',         // 百度小游戏
    WEB = 'web'              // H5网页
}

export interface ShareConfig {
    title: string;
    desc: string;
    imageUrl: string;
    query?: string;           // 分享参数（如邀请码）
    path?: string;            // 页面路径
}

export interface ShareResult {
    success: boolean;
    platform: PlatformType;
    shareTicket?: string;     // 微信分享票据
    error?: string;
}

export class PlatformShareAdapter {
    private currentPlatform: PlatformType = PlatformType.WEB;
    private sdkReady: boolean = false;
    
    constructor() {
        this.detectPlatform();
    }
    
    /**
     * 自动检测当前平台
     */
    private detectPlatform(): void {
        if (typeof wx !== 'undefined') {
            this.currentPlatform = PlatformType.WECHAT;
        } else if (typeof qq !== 'undefined') {
            this.currentPlatform = PlatformType.QQ;
        } else if (typeof tt !== 'undefined') {
            this.currentPlatform = PlatformType.DOUYIN;
        } else if (typeof ks !== 'undefined') {
            this.currentPlatform = PlatformType.KUAISHOU;
        } else if (typeof qg !== 'undefined') {
            // 判断是OPPO还是VIVO
            if (qg.getSystemInfoSync) {
                const info = qg.getSystemInfoSync();
                if (info.brand === 'OPPO') {
                    this.currentPlatform = PlatformType.OPPO;
                } else {
                    this.currentPlatform = PlatformType.VIVO;
                }
            }
        } else if (typeof swan !== 'undefined') {
            this.currentPlatform = PlatformType.BAIDU;
        } else {
            this.currentPlatform = PlatformType.WEB;
        }
        
        console.log(`[PlatformShare] Detected platform: ${this.currentPlatform}`);
    }
    
    /**
     * 初始化SDK
     */
    public async init(): Promise<boolean> {
        try {
            switch (this.currentPlatform) {
                case PlatformType.WECHAT:
                    // 微信分享监听
                    if (typeof wx !== 'undefined') {
                        wx.showShareMenu({
                            withShareTicket: true,
                            menus: ['shareAppMessage', 'shareTimeline']
                        });
                        
                        wx.onShareAppMessage(() => {
                            return this.getDefaultShareConfig();
                        });
                    }
                    break;
                    
                case PlatformType.QQ:
                    if (typeof qq !== 'undefined') {
                        qq.showShareMenu({
                            showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
                        });
                    }
                    break;
                    
                case PlatformType.DOUYIN:
                    // 抖音分享需要在game.json中配置
                    break;
                    
                default:
                    break;
            }
            
            this.sdkReady = true;
            return true;
        } catch (error) {
            console.error('[PlatformShare] Init failed:', error);
            return false;
        }
    }
    
    /**
     * 主动分享
     */
    public async share(config?: Partial<ShareConfig>): Promise<ShareResult> {
        const fullConfig = { ...this.getDefaultShareConfig(), ...config };
        
        try {
            switch (this.currentPlatform) {
                case PlatformType.WECHAT:
                    return await this.shareToWechat(fullConfig);
                    
                case PlatformType.QQ:
                    return await this.shareToQQ(fullConfig);
                    
                case PlatformType.DOUYIN:
                    return await this.shareToDouyin(fullConfig);
                    
                case PlatformType.KUAISHOU:
                    return await this.shareToKuaishou(fullConfig);
                    
                case PlatformType.WEB:
                    return await this.shareToWeb(fullConfig);
                    
                default:
                    return {
                        success: false,
                        platform: this.currentPlatform,
                        error: '未实现的平台分享'
                    };
            }
        } catch (error) {
            console.error('[PlatformShare] Share failed:', error);
            return {
                success: false,
                platform: this.currentPlatform,
                error: String(error)
            };
        }
    }
    
    /**
     * 微信分享
     */
    private async shareToWechat(config: ShareConfig): Promise<ShareResult> {
        return new Promise((resolve) => {
            if (typeof wx === 'undefined') {
                resolve({ success: false, platform: PlatformType.WECHAT, error: 'SDK未加载' });
                return;
            }
            
            wx.shareAppMessage({
                title: config.title,
                imageUrl: config.imageUrl,
                query: config.query,
                success: (res: any) => {
                    resolve({
                        success: true,
                        platform: PlatformType.WECHAT,
                        shareTicket: res.shareTickets?.[0]
                    });
                },
                fail: (err: any) => {
                    resolve({
                        success: false,
                        platform: PlatformType.WECHAT,
                        error: err.errMsg
                    });
                }
            });
        });
    }
    
    /**
     * QQ分享
     */
    private async shareToQQ(config: ShareConfig): Promise<ShareResult> {
        return new Promise((resolve) => {
            if (typeof qq === 'undefined') {
                resolve({ success: false, platform: PlatformType.QQ, error: 'SDK未加载' });
                return;
            }
            
            qq.shareAppMessage({
                title: config.title,
                desc: config.desc,
                imageUrl: config.imageUrl,
                query: config.query,
                success: () => {
                    resolve({ success: true, platform: PlatformType.QQ });
                },
                fail: (err: any) => {
                    resolve({ success: false, platform: PlatformType.QQ, error: err });
                }
            });
        });
    }
    
    /**
     * 抖音分享
     */
    private async shareToDouyin(config: ShareConfig): Promise<ShareResult> {
        return new Promise((resolve) => {
            if (typeof tt === 'undefined') {
                resolve({ success: false, platform: PlatformType.DOUYIN, error: 'SDK未加载' });
                return;
            }
            
            // 抖音支持录屏分享
            tt.shareAppMessage({
                title: config.title,
                imageUrl: config.imageUrl,
                query: config.query,
                success: () => {
                    resolve({ success: true, platform: PlatformType.DOUYIN });
                },
                fail: (err: any) => {
                    resolve({ success: false, platform: PlatformType.DOUYIN, error: err });
                }
            });
        });
    }
    
    /**
     * 快手分享
     */
    private async shareToKuaishou(config: ShareConfig): Promise<ShareResult> {
        return new Promise((resolve) => {
            if (typeof ks === 'undefined') {
                resolve({ success: false, platform: PlatformType.KUAISHOU, error: 'SDK未加载' });
                return;
            }
            
            ks.shareAppMessage({
                title: config.title,
                imageUrl: config.imageUrl,
                success: () => {
                    resolve({ success: true, platform: PlatformType.KUAISHOU });
                },
                fail: (err: any) => {
                    resolve({ success: false, platform: PlatformType.KUAISHOU, error: err });
                }
            });
        });
    }
    
    /**
     * Web分享（使用Web Share API）
     */
    private async shareToWeb(config: ShareConfig): Promise<ShareResult> {
        if (typeof navigator === 'undefined' || !navigator.share) {
            // 降级到复制链接
            this.copyToClipboard(config);
            return {
                success: true,
                platform: PlatformType.WEB,
                error: '已复制链接到剪贴板'
            };
        }
        
        try {
            await navigator.share({
                title: config.title,
                text: config.desc,
                url: window.location.href + (config.query ? `?${config.query}` : '')
            });
            return { success: true, platform: PlatformType.WEB };
        } catch (error) {
            return { success: false, platform: PlatformType.WEB, error: String(error) };
        }
    }
    
    /**
     * 复制到剪贴板
     */
    private copyToClipboard(config: ShareConfig): void {
        const text = `${config.title}\n${config.desc}\n${window.location.href}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            // 降级方案
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    }
    
    /**
     * 获取默认分享配置
     */
    private getDefaultShareConfig(): ShareConfig {
        return {
            title: '记忆回收者 - 开启你的卡牌之旅',
            desc: '超人气卡牌养成RPG，登录送百抽！',
            imageUrl: 'https://cdn.example.com/share_default.png',
            query: 'ref=share',
            path: '/pages/index/index'
        };
    }
    
    /**
     * 获取分享配置模板
     */
    public getShareTemplate(type: 'battle_win' | 'new_card' | 'invite'): ShareConfig {
        const templates: Record<string, ShareConfig> = {
            battle_win: {
                title: '我刚刚赢得了一场精彩的对决！',
                desc: '来《记忆回收者》挑战我吧！',
                imageUrl: 'https://cdn.example.com/share_battle.png'
            },
            new_card: {
                title: '我抽到了稀有卡牌！',
                desc: '快来试试你的手气~',
                imageUrl: 'https://cdn.example.com/share_gacha.png'
            },
            invite: {
                title: '邀请你加入《记忆回收者》',
                desc: '登录送百抽，一起来收集卡牌吧！',
                imageUrl: 'https://cdn.example.com/share_invite.png'
            }
        };
        
        return templates[type] || this.getDefaultShareConfig();
    }
    
    /**
     * 获取当前平台
     */
    public getCurrentPlatform(): PlatformType {
        return this.currentPlatform;
    }
    
    /**
     * 是否支持当前平台
     */
    public isPlatformSupported(platform: PlatformType): boolean {
        return this.currentPlatform === platform;
    }
}

// 单例
export const platformShareAdapter = new PlatformShareAdapter();
