/**
 * 主城场景 - 完整版
 * 包含丰富的视觉效果、NPC动画、环境特效
 */

import { 
    _decorator, Node, Label, Sprite, Color, Vec3, tween, 
    ParticleSystem2D, UIOpacity, Animation, easing 
} from 'cc';
import { EnhancedScene } from '../base/EnhancedScene';
import { GameScene, sceneManager } from '../../core/SceneManager';
import { playerDataManager } from '../../data/PlayerData';

const { ccclass, property } = _decorator;

interface NPCConfig {
    id: string;
    name: string;
    node: Node | null;
    position: Vec3;
    scale: number;
    idleAnimation: string;
    clickAction: () => void;
}

@ccclass('CitySceneEnhanced')
export class CitySceneEnhanced extends EnhancedScene {
    
    // ============ NPC节点 ============
    @property(Node)
    private shopNode: Node | null = null;
    
    @property(Node)
    private tavernNode: Node | null = null;
    
    @property(Node)
    private forgeNode: Node | null = null;
    
    @property(Node)
    private guildNode: Node | null = null;
    
    @property(Node)
    private trainingNode: Node | null = null;
    
    @property(Node)
    private questBoardNode: Node | null = null;
    
    @property(Node)
    private dailyRewardNode: Node | null = null;
    
    // ============ 资源显示 ============
    @property(Node)
    private resourceBar: Node | null = null;
    
    @property(Label)
    private goldLabel: Label | null = null;
    
    @property(Label)
    private crystalLabel: Label | null = null;
    
    @property(Label)
    private staminaLabel: Label | null = null;
    
    // ============ 特效节点 ============
    @property(Node)
    private lanternNode: Node | null = null;
    
    @property(Node)
    private cloudNode: Node | null = null;
    
    @property(Node)
    private particleRoot: Node | null = null;
    
    // NPC配置
    private npcs: Map<string, NPCConfig> = new Map();
    
    onLoad() {
        super.onLoad();
        this.initCityScene();
    }
    
    onEnable() {
        this.refreshResourceDisplay();
        this.startAmbientAnimations();
        this.playNPCIdleAnimations();
    }
    
    /**
     * 初始化主城场景
     */
    private initCityScene() {
        // 应用主城场景配置
        this.applySceneConfig({
            id: 'main_city',
            name: '主城',
            backgroundImage: 'scenes/city/main_city_bg.png',
            bgm: 'bgm_city_peaceful',
            lighting: 'normal',
            ambientEffect: 'floating_lanterns'
        });
        
        this.setupNPCs();
        this.createAmbientEffects();
    }
    
    /**
     * 设置NPC
     */
    private setupNPCs() {
        this.npcs.set('shop', {
            id: 'shop',
            name: '商店',
            node: this.shopNode,
            position: new Vec3(-200, 100, 0),
            scale: 1,
            idleAnimation: 'bounce',
            clickAction: () => this.openShop()
        });
        
        this.npcs.set('tavern', {
            id: 'tavern',
            name: '酒馆',
            node: this.tavernNode,
            position: new Vec3(200, 150, 0),
            scale: 1.1,
            idleAnimation: 'glow',
            clickAction: () => this.openGacha()
        });
        
        this.npcs.set('forge', {
            id: 'forge',
            name: '铁匠铺',
            node: this.forgeNode,
            position: new Vec3(-250, -100, 0),
            scale: 0.9,
            idleAnimation: 'spark',
            clickAction: () => this.openForge()
        });
        
        this.npcs.set('guild', {
            id: 'guild',
            name: '公会',
            node: this.guildNode,
            position: new Vec3(250, -50, 0),
            scale: 1,
            idleAnimation: 'float',
            clickAction: () => this.openGuild()
        });
        
        this.npcs.set('training', {
            id: 'training',
            name: '训练场',
            node: this.trainingNode,
            position: new Vec3(0, -200, 0),
            scale: 1.2,
            idleAnimation: 'pulse',
            clickAction: () => this.openPVP()
        });
        
        // 注册点击事件和初始位置
        this.npcs.forEach((npc, key) => {
            if (npc.node) {
                npc.node.setPosition(npc.position);
                npc.node.setScale(npc.scale, npc.scale, 1);
                
                // 添加点击事件
                npc.node.on(Node.EventType.TOUCH_END, () => {
                    this.onNPCClick(key);
                }, this);
                
                // 添加名称标签
                this.addNPCLabel(npc);
            }
        });
    }
    
    /**
     * 添加NPC名称标签
     */
    private addNPCLabel(npc: NPCConfig) {
        if (!npc.node) return;
        
        const labelNode = new Node('NPCLabel');
        const label = labelNode.addComponent(Label);
        label.string = npc.name;
        label.fontSize = 24;
        label.color = new Color(255, 255, 200);
        labelNode.setPosition(0, 80, 0);
        
        npc.node.addChild(labelNode);
    }
    
    /**
     * NPC点击处理
     */
    private onNPCClick(npcId: string) {
        const npc = this.npcs.get(npcId);
        if (!npc) return;
        
        // 播放点击音效
        // audioManager.playSFX('ui_click');
        
        // 播放点击动画
        this.playClickAnimation(npc.node!);
        
        // 执行动作
        npc.clickAction();
    }
    
    /**
     * 播放点击动画
     */
    private playClickAnimation(node: Node) {
        // 缩放动画
        tween(node)
            .to(0.1, { scale: new Vec3(0.9, 0.9, 1) })
            .to(0.1, { scale: new Vec3(1.1, 1.1, 1) })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .start();
    }
    
    /**
     * 播放NPC待机动画
     */
    private playNPCIdleAnimations() {
        this.npcs.forEach((npc, key) => {
            if (!npc.node) return;
            
            switch (npc.idleAnimation) {
                case 'bounce':
                    this.animateBounce(npc.node);
                    break;
                case 'float':
                    this.animateFloat(npc.node);
                    break;
                case 'pulse':
                    this.animatePulse(npc.node);
                    break;
                case 'glow':
                    this.animateGlow(npc.node);
                    break;
                case 'spark':
                    this.animateSpark(npc.node);
                    break;
            }
        });
    }
    
    /**
     * 弹跳动画
     */
    private animateBounce(node: Node) {
        tween(node)
            .by(0.5, { position: new Vec3(0, 10, 0) }, { easing: 'quadOut' })
            .by(0.5, { position: new Vec3(0, -10, 0) }, { easing: 'quadIn' })
            .delay(1)
            .union()
            .repeatForever()
            .start();
    }
    
    /**
     * 漂浮动画
     */
    private animateFloat(node: Node) {
        tween(node)
            .by(2, { position: new Vec3(0, 15, 0) }, { easing: 'sineInOut' })
            .by(2, { position: new Vec3(0, -15, 0) }, { easing: 'sineInOut' })
            .union()
            .repeatForever()
            .start();
    }
    
    /**
     * 脉冲动画
     */
    private animatePulse(node: Node) {
        const baseScale = node.scale.x;
        tween(node)
            .to(1, { scale: new Vec3(baseScale * 1.05, baseScale * 1.05, 1) })
            .to(1, { scale: new Vec3(baseScale, baseScale, 1) })
            .union()
            .repeatForever()
            .start();
    }
    
    /**
     * 发光动画
     */
    private animateGlow(node: Node) {
        const sprite = node.getComponent(Sprite);
        if (!sprite) return;
        
        // 改变透明度模拟发光
        const uiOpacity = node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
        tween(uiOpacity)
            .to(1.5, { opacity: 200 })
            .to(1.5, { opacity: 255 })
            .union()
            .repeatForever()
            .start();
    }
    
    /**
     * 火花动画（铁匠铺）
     */
    private animateSpark(node: Node) {
        // 定时创建火花粒子
        this.schedule(() => {
            this.spawnSpark(node.position);
        }, 2);
    }
    
    /**
     * 生成火花
     */
    private spawnSpark(position: Vec3) {
        if (!this.effectLayer) return;
        
        const spark = new Node('Spark');
        spark.setPosition(position.x + Math.random() * 60 - 30, position.y + 40, 0);
        
        const sprite = spark.addComponent(Sprite);
        sprite.color = new Color(255, 150, 50);
        
        this.effectLayer.addChild(spark);
        
        // 抛物线运动
        const targetX = spark.position.x + Math.random() * 100 - 50;
        const targetY = spark.position.y + Math.random() * 50 + 30;
        
        tween(spark)
            .to(0.5, { position: new Vec3(targetX, targetY, 0) })
            .call(() => spark.destroy())
            .start();
    }
    
    /**
     * 创建环境特效
     */
    private createAmbientEffects() {
        this.createFloatingLanterns();
        this.createClouds();
        this.createFireflies();
    }
    
    /**
     * 创建漂浮灯笼
     */
    private createFloatingLanterns() {
        if (!this.effectLayer) return;
        
        // 创建多个灯笼
        for (let i = 0; i < 5; i++) {
            const lantern = new Node(`Lantern_${i}`);
            const startX = Math.random() * 600 - 300;
            lantern.setPosition(startX, -300, 0);
            
            const sprite = lantern.addComponent(Sprite);
            sprite.color = new Color(255, 180, 100);
            
            this.effectLayer.addChild(lantern);
            
            // 漂浮上升动画
            this.animateLantern(lantern);
        }
    }
    
    /**
     * 灯笼动画
     */
    private animateLantern(node: Node) {
        const duration = 15 + Math.random() * 10;
        const endY = 900;
        const swingRange = 30 + Math.random() * 20;
        
        // 上升
        tween(node)
            .to(duration, { position: new Vec3(node.position.x, endY, 0) })
            .call(() => {
                node.setPosition(Math.random() * 600 - 300, -300, 0);
                this.animateLantern(node);
            })
            .start();
        
        // 摇摆
        tween(node)
            .by(3, { position: new Vec3(swingRange, 0, 0) })
            .by(3, { position: new Vec3(-swingRange * 2, 0, 0) })
            .by(3, { position: new Vec3(swingRange, 0, 0) })
            .union()
            .repeatForever()
            .start();
    }
    
    /**
     * 创建云朵
     */
    private createClouds() {
        if (!this.farLayer) return;
        
        for (let i = 0; i < 3; i++) {
            const cloud = new Node(`Cloud_${i}`);
            cloud.setPosition(-400 - i * 200, 300 + Math.random() * 100, 0);
            
            const sprite = cloud.addComponent(Sprite);
            sprite.color = new Color(255, 255, 255, 100);
            
            this.farLayer.addChild(cloud);
            
            // 缓慢移动
            tween(cloud)
                .to(30 + i * 10, { position: new Vec3(500, cloud.position.y, 0) })
                .call(() => {
                    cloud.setPosition(-400, cloud.position.y, 0);
                })
                .repeatForever()
                .start();
        }
    }
    
    /**
     * 创建萤火虫效果
     */
    private createFireflies() {
        if (!this.effectLayer) return;
        
        // 持续生成萤火虫
        this.schedule(() => {
            this.spawnFirefly();
        }, 1.5);
    }
    
    /**
     * 生成萤火虫
     */
    private spawnFirefly() {
        if (!this.effectLayer) return;
        
        const firefly = new Node('Firefly');
        const startX = Math.random() * 700 - 350;
        const startY = -200 + Math.random() * 400;
        firefly.setPosition(startX, startY, 0);
        
        const sprite = firefly.addComponent(Sprite);
        sprite.color = new Color(150, 255, 150);
        
        // 初始缩放很小
        firefly.setScale(0.2, 0.2, 1);
        
        this.effectLayer.addChild(firefly);
        
        // 闪烁并移动
        const targetX = startX + Math.random() * 200 - 100;
        const targetY = startY + Math.random() * 200 - 100;
        
        tween(firefly)
            .to(0.3, { scale: new Vec3(0.4, 0.4, 1) })
            .to(0.3, { scale: new Vec3(0.2, 0.2, 1) })
            .union()
            .repeat(3)
            .start();
        
        tween(firefly)
            .to(3, { position: new Vec3(targetX, targetY, 0) })
            .call(() => firefly.destroy())
            .start();
    }
    
    /**
     * 启动环境动画
     */
    private startAmbientAnimations() {
        // 背景缓慢移动（视差效果）
        if (this.backgroundLayer) {
            tween(this.backgroundLayer)
                .by(60, { position: new Vec3(10, 0, 0) })
                .by(60, { position: new Vec3(-10, 0, 0) })
                .union()
                .repeatForever()
                .start();
        }
    }
    
    /**
     * 刷新资源显示
     */
    private refreshResourceDisplay() {
        const player = playerDataManager.getPlayerData();
        
        if (this.goldLabel) {
            this.goldLabel.string = this.formatNumber(player.gold);
        }
        if (this.crystalLabel) {
            this.crystalLabel.string = this.formatNumber(player.soulCrystal);
        }
        if (this.staminaLabel) {
            // this.staminaLabel.string = `${player.stamina}/${player.maxStamina}`;
        }
    }
    
    /**
     * 格式化数字
     */
    private formatNumber(num: number): string {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }
    
    // ============ 功能入口 ============
    
    private openShop() {
        console.log('[City] 打开商店');
        sceneManager.switchTo(GameScene.CITY, true);
        // UIManager.open('ShopPanel');
    }
    
    private openGacha() {
        console.log('[City] 打开酒馆（抽卡）');
        // sceneManager.switchTo(GameScene.GACHA, true);
    }
    
    private openForge() {
        console.log('[City] 打开铁匠铺');
        // UIManager.open('ForgePanel');
    }
    
    private openGuild() {
        console.log('[City] 打开公会');
        // UIManager.open('GuildPanel');
    }
    
    private openPVP() {
        console.log('[City] 打开训练场（PVP）');
        // UIManager.open('PVPPanel');
    }
    
    // ============ UI按钮 ============
    
    public onQuestClick() {
        console.log('[City] 打开任务');
        // UIManager.open('QuestPanel');
    }
    
    public onMailClick() {
        console.log('[City] 打开邮件');
        // UIManager.open('MailPanel');
    }
    
    public onBagClick() {
        console.log('[City] 打开背包');
        // UIManager.open('BagPanel');
    }
    
    public onSettingsClick() {
        console.log('[City] 打开设置');
        sceneManager.switchTo(GameScene.SETTINGS, true);
    }
    
    public onAdventureClick() {
        console.log('[City] 前往探险');
        sceneManager.switchTo(GameScene.ADVENTURE, true);
    }
}
