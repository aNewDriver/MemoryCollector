/**
 * 场景增强基类
 * 提供背景图加载、环境效果、光照控制等通用功能
 */

import { _decorator, Component, Node, Sprite, SpriteFrame, Color, director, ParticleSystem2D, Vec3, tween, UIOpacity } from 'cc';
import { SceneConfig } from '../scene/SceneConfig';

const { ccclass, property } = _decorator;

export interface SceneEffect {
    type: 'particle' | 'light' | 'fog' | 'ripple' | 'floating';
    node: Node;
    params: any;
}

@ccclass('EnhancedScene')
export abstract class EnhancedScene extends Component {
    
    // 背景层
    @property(Node)
    protected backgroundLayer: Node | null = null;
    
    // 远景层（视差滚动）
    @property(Node)
    protected farLayer: Node | null = null;
    
    // 中景层
    @property(Node)
    protected midLayer: Node | null = null;
    
    // 近景层
    @property(Node)
    protected nearLayer: Node | null = null;
    
    // UI层
    @property(Node)
    protected uiLayer: Node | null = null;
    
    // 特效层
    @property(Node)
    protected effectLayer: Node | null = null;
    
    // 光照遮罩
    @property(Node)
    protected lightingOverlay: Node | null = null;
    
    protected currentSceneConfig: SceneConfig | null = null;
    protected activeEffects: SceneEffect[] = [];
    
    onLoad() {
        this.initLayers();
    }
    
    /**
     * 初始化场景层级
     */
    private initLayers() {
        // 确保各层级存在
        if (!this.backgroundLayer) {
            this.backgroundLayer = this.createLayer('BackgroundLayer', -10);
        }
        if (!this.farLayer) {
            this.farLayer = this.createLayer('FarLayer', -5);
        }
        if (!this.midLayer) {
            this.midLayer = this.createLayer('MidLayer', 0);
        }
        if (!this.nearLayer) {
            this.nearLayer = this.createLayer('NearLayer', 5);
        }
        if (!this.effectLayer) {
            this.effectLayer = this.createLayer('EffectLayer', 10);
        }
        if (!this.uiLayer) {
            this.uiLayer = this.createLayer('UILayer', 20);
        }
    }
    
    /**
     * 创建层级节点
     */
    private createLayer(name: string, zOrder: number): Node {
        const layer = new Node(name);
        layer.setPosition(0, 0, 0);
        this.node.addChild(layer);
        return layer;
    }
    
    /**
     * 应用场景配置
     */
    protected applySceneConfig(config: SceneConfig) {
        this.currentSceneConfig = config;
        
        // 加载背景图
        this.loadBackgroundImage(config.backgroundImage);
        
        // 应用光照效果
        this.applyLighting(config.lighting);
        
        // 添加环境特效
        if (config.ambientEffect) {
            this.addAmbientEffect(config.ambientEffect);
        }
        
        // 播放BGM
        this.playBGM(config.bgm);
    }
    
    /**
     * 加载背景图片
     */
    protected loadBackgroundImage(imagePath: string) {
        // 使用resources.load动态加载背景图
        const resources = director.getScene()?.getComponentInChildren('Resources');
        if (resources) {
            // 实际项目中这里会加载SpriteFrame
            console.log(`[Scene] 加载背景图: ${imagePath}`);
        }
        
        // 创建背景精灵
        if (this.backgroundLayer) {
            const bgNode = new Node('Background');
            const sprite = bgNode.addComponent(Sprite);
            // sprite.spriteFrame = loadedSpriteFrame;
            
            // 设置背景色作为占位
            sprite.color = this.getSceneColor();
            
            // 全屏适配
            const uiTransform = bgNode.addComponent(UITransform);
            uiTransform.setContentSize(750, 1334);
            uiTransform.anchorPoint.set(0.5, 0.5);
            
            this.backgroundLayer.addChild(bgNode);
        }
    }
    
    /**
     * 根据场景类型获取背景色
     */
    protected getSceneColor(): Color {
        if (!this.currentSceneConfig) return new Color(30, 30, 50);
        
        switch (this.currentSceneConfig.lighting) {
            case 'dark':
                return new Color(25, 25, 35);
            case 'bright':
                return new Color(240, 240, 230);
            case 'mysterious':
                return new Color(40, 30, 60);
            case 'normal':
            default:
                return new Color(45, 45, 55);
        }
    }
    
    /**
     * 应用光照效果
     */
    protected applyLighting(lighting: string) {
        if (!this.lightingOverlay) return;
        
        const opacity = this.lightingOverlay.getComponent(UIOpacity);
        if (!opacity) return;
        
        let targetOpacity = 0;
        let overlayColor = new Color(0, 0, 0);
        
        switch (lighting) {
            case 'dark':
                targetOpacity = 80;
                overlayColor = new Color(0, 0, 20);
                break;
            case 'bright':
                targetOpacity = 0;
                overlayColor = new Color(255, 255, 240);
                break;
            case 'mysterious':
                targetOpacity = 60;
                overlayColor = new Color(30, 0, 50);
                break;
            case 'normal':
            default:
                targetOpacity = 30;
                overlayColor = new Color(0, 0, 10);
                break;
        }
        
        // 渐变过渡
        tween(opacity)
            .to(1.0, { opacity: targetOpacity })
            .start();
        
        const sprite = this.lightingOverlay.getComponent(Sprite);
        if (sprite) {
            sprite.color = overlayColor;
        }
    }
    
    /**
     * 添加环境特效
     */
    protected addAmbientEffect(effectType: string) {
        switch (effectType) {
            case 'ink_ripple':
                this.createInkRippleEffect();
                break;
            case 'floating_paper':
                this.createFloatingPaperEffect();
                break;
            case 'bubble':
                this.createBubbleEffect();
                break;
            case 'whisper_particle':
                this.createWhisperEffect();
                break;
            case 'mirror_shine':
                this.createMirrorShineEffect();
                break;
            case 'boss_aura':
                this.createBossAuraEffect();
                break;
            case 'sound_wave':
                this.createSoundWaveEffect();
                break;
        }
    }
    
    /**
     * 创建墨水涟漪效果
     */
    private createInkRippleEffect() {
        if (!this.effectLayer) return;
        
        const rippleNode = new Node('InkRipple');
        // 添加粒子系统或动画
        this.effectLayer.addChild(rippleNode);
        
        this.activeEffects.push({
            type: 'ripple',
            node: rippleNode,
            params: { interval: 2.0, intensity: 0.5 }
        });
        
        console.log('[Scene] 添加墨水涟漪效果');
    }
    
    /**
     * 创建漂浮书页效果
     */
    private createFloatingPaperEffect() {
        if (!this.effectLayer) return;
        
        // 创建多个漂浮的书页
        for (let i = 0; i < 5; i++) {
            const paperNode = new Node(`FloatingPaper_${i}`);
            
            // 随机初始位置
            const startX = Math.random() * 600 - 300;
            const startY = -400 - Math.random() * 200;
            paperNode.setPosition(startX, startY, 0);
            
            // 添加漂浮动画
            this.scheduleOnce(() => {
                this.animateFloatingPaper(paperNode);
            }, i * 0.5);
            
            this.effectLayer.addChild(paperNode);
        }
        
        this.activeEffects.push({
            type: 'floating',
            node: this.effectLayer,
            params: { count: 5, speed: 1.0 }
        });
        
        console.log('[Scene] 添加漂浮书页效果');
    }
    
    /**
     * 书页漂浮动画
     */
    private animateFloatingPaper(node: Node) {
        const duration = 8 + Math.random() * 4;
        const endY = 800 + Math.random() * 200;
        const swingRange = 50 + Math.random() * 100;
        
        // 上升动画
        tween(node)
            .to(duration, { position: new Vec3(0, endY, 0) })
            .call(() => {
                // 重置位置，循环播放
                node.setPosition(Math.random() * 600 - 300, -400 - Math.random() * 200, 0);
                this.animateFloatingPaper(node);
            })
            .start();
        
        // 左右摇摆
        tween(node)
            .by(2, { position: new Vec3(swingRange, 0, 0) })
            .by(2, { position: new Vec3(-swingRange * 2, 0, 0) })
            .by(2, { position: new Vec3(swingRange, 0, 0) })
            .union()
            .repeatForever()
            .start();
    }
    
    /**
     * 创建气泡效果
     */
    private createBubbleEffect() {
        if (!this.effectLayer) return;
        
        // 持续生成上升的气泡
        this.schedule(() => {
            this.spawnBubble();
        }, 0.8);
        
        console.log('[Scene] 添加气泡效果');
    }
    
    /**
     * 生成单个气泡
     */
    private spawnBubble() {
        if (!this.effectLayer) return;
        
        const bubble = new Node('Bubble');
        const startX = Math.random() * 700 - 350;
        bubble.setPosition(startX, -600, 0);
        
        // 大小随机
        const scale = 0.3 + Math.random() * 0.4;
        bubble.setScale(scale, scale, 1);
        
        this.effectLayer.addChild(bubble);
        
        // 上升动画
        const duration = 4 + Math.random() * 3;
        tween(bubble)
            .to(duration, { position: new Vec3(startX + Math.random() * 100 - 50, 800, 0) })
            .call(() => bubble.destroy())
            .start();
    }
    
    /**
     * 创建低语粒子效果
     */
    private createWhisperEffect() {
        if (!this.effectLayer) return;
        
        console.log('[Scene] 添加低语粒子效果');
    }
    
    /**
     * 创建镜面闪光效果
     */
    private createMirrorShineEffect() {
        if (!this.effectLayer) return;
        
        // 定时创建闪光
        this.schedule(() => {
            this.spawnMirrorShine();
        }, 3);
        
        console.log('[Scene] 添加镜面闪光效果');
    }
    
    /**
     * 生成镜面闪光
     */
    private spawnMirrorShine() {
        if (!this.effectLayer) return;
        
        const shine = new Node('MirrorShine');
        shine.setPosition(Math.random() * 600 - 300, Math.random() * 400 - 200, 0);
        
        this.effectLayer.addChild(shine);
        
        // 闪光动画
        shine.setScale(0, 0, 1);
        tween(shine)
            .to(0.3, { scale: new Vec3(1.5, 1.5, 1) })
            .to(0.3, { scale: new Vec3(0, 0, 1) })
            .call(() => shine.destroy())
            .start();
    }
    
    /**
     * 创建Boss气场效果
     */
    private createBossAuraEffect() {
        if (!this.effectLayer) return;
        
        const aura = new Node('BossAura');
        aura.setPosition(0, 0, 0);
        
        // 脉冲动画
        tween(aura)
            .to(2, { scale: new Vec3(1.2, 1.2, 1) })
            .to(2, { scale: new Vec3(1.0, 1.0, 1) })
            .union()
            .repeatForever()
            .start();
        
        this.effectLayer.addChild(aura);
        
        this.activeEffects.push({
            type: 'light',
            node: aura,
            params: { intensity: 1.0, color: new Color(255, 0, 50) }
        });
        
        console.log('[Scene] 添加Boss气场效果');
    }
    
    /**
     * 创建声波效果
     */
    private createSoundWaveEffect() {
        if (!this.effectLayer) return;
        
        // 从中心扩散的圆环
        this.schedule(() => {
            this.spawnSoundWave();
        }, 2);
        
        console.log('[Scene] 添加声波效果');
    }
    
    /**
     * 生成声波圆环
     */
    private spawnSoundWave() {
        if (!this.effectLayer) return;
        
        const wave = new Node('SoundWave');
        wave.setPosition(0, 0, 0);
        wave.setScale(0.1, 0.1, 1);
        
        this.effectLayer.addChild(wave);
        
        tween(wave)
            .to(3, { scale: new Vec3(5, 5, 1) })
            .to(3, { opacity: 0 }, { easing: 'fade' })
            .call(() => wave.destroy())
            .start();
    }
    
    /**
     * 播放背景音乐
     */
    protected playBGM(bgmName: string) {
        console.log(`[Scene] 播放BGM: ${bgmName}`);
        // audioManager.playBGM(bgmName);
    }
    
    /**
     * 清除所有特效
     */
    protected clearEffects() {
        this.activeEffects.forEach(effect => {
            if (effect.node && effect.node.isValid) {
                effect.node.destroy();
            }
        });
        this.activeEffects = [];
        this.unscheduleAllCallbacks();
    }
    
    onDestroy() {
        this.clearEffects();
    }
}
