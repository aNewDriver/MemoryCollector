/**
 * 世界地图可视化系统
 * 显示各章节位置，可点击选择，带路线连接和章节解锁动画
 */

import { 
    _decorator, Component, Node, Graphics, Vec3, Color, 
    tween, Sprite, Label, UITransform, Vec2, instantiate, 
    Prefab, Animation, UIOpacity, ParticleSystem2D 
} from 'cc';
import { EnhancedScene } from '../base/EnhancedScene';
import { GameScene, sceneManager } from '../../core/SceneManager';
import { playerDataManager } from '../../data/PlayerData';

const { ccclass, property } = _decorator;

// 章节数据
interface ChapterData {
    id: number;
    name: string;
    description: string;
    position: Vec3;
    icon: string;
    themeColor: Color;
    unlockRequirement: {
        prevChapter: number;
        level: number;
    };
    isUnlocked: boolean;
    isCompleted: boolean;
    stars: number;
    maxStars: number;
}

// 路线连接
interface ChapterRoute {
    from: number;
    to: number;
    path: Vec3[];  // 路径点
}

@ccclass('WorldMapEnhanced')
export class WorldMapEnhanced extends EnhancedScene {
    
    // ============ 章节数据 ============
    private chapters: Map<number, ChapterData> = new Map();
    private chapterNodes: Map<number, Node> = new Map();
    private routes: ChapterRoute[] = [];
    
    // ============ 容器节点 ============
    @property(Node)
    private mapContainer: Node | null = null;
    
    @property(Node)
    private routeLayer: Node | null = null;
    
    @property(Node)
    private chapterLayer: Node | null = null;
    
    @property(Node)
    private decorationLayer: Node | null = null;
    
    @property(Node)
    private cloudLayer: Node | null = null;
    
    // ============ 预制体 ============
    @property(Prefab)
    private chapterNodePrefab: Prefab | null = null;
    
    // ============ UI元素 ============
    @property(Node)
    private chapterInfoPanel: Node | null = null;
    
    @property(Label)
    private chapterNameLabel: Label | null = null;
    
    @property(Label)
    private chapterDescLabel: Label | null = null;
    
    @property(Label)
    private chapterProgressLabel: Label | null = null;
    
    @property(Node)
    private startButton: Node | null = null;
    
    @property(Node)
    private lockOverlay: Node | null = null;
    
    // 当前选中的章节
    private selectedChapterId: number | null = null;
    
    // ============ 地图配置 ============
    private readonly CHAPTER_POSITIONS: Vec3[] = [
        new Vec3(0, -400, 0),       // 第1章 - 底部
        new Vec3(-150, -200, 0),    // 第2章
        new Vec3(200, -150, 0),     // 第3章
        new Vec3(0, 50, 0),         // 第4章
        new Vec3(-200, 200, 0),     // 第5章
        new Vec3(180, 300, 0),      // 第6章
        new Vec3(-100, 450, 0),     // 第7章
        new Vec3(150, 550, 0),      // 第8章
        new Vec3(-50, 700, 0),      // 第9章
        new Vec3(0, 850, 0),        // 第10章 - 顶部
    ];
    
    onLoad() {
        super.onLoad();
        this.initWorldMap();
    }
    
    onEnable() {
        this.loadChapterData();
        this.renderWorldMap();
        this.playEntryAnimation();
    }
    
    /**
     * 初始化世界地图
     */
    private initWorldMap() {
        this.applySceneConfig({
            id: 'world_map',
            name: '记忆世界',
            backgroundImage: 'scenes/world/world_map_bg.png',
            bgm: 'bgm_world_exploration',
            lighting: 'normal',
            ambientEffect: 'floating_clouds'
        });
        
        this.initChapterData();
    }
    
    /**
     * 初始化章节数据
     */
    private initChapterData() {
        const chapterConfigs = [
            { id: 1, name: '记忆迷宫', desc: '在遗忘的图书馆中寻找真相', icon: '📚', color: new Color(100, 150, 200) },
            { id: 2, name: '遗忘之境', desc: '穿越迷雾笼罩的荒野', icon: '🌫️', color: new Color(150, 150, 150) },
            { id: 3, name: '深海回忆', desc: '潜入记忆的深渊', icon: '🌊', color: new Color(50, 150, 200) },
            { id: 4, name: '愤怒火山', desc: '穿越炽热的愤怒之地', icon: '🌋', color: new Color(255, 100, 50) },
            { id: 5, name: '时光回廊', desc: '在时间的缝隙中穿行', icon: '⏳', color: new Color(200, 200, 100) },
            { id: 6, name: '虚空边境', desc: '面对无尽的虚空', icon: '🌑', color: new Color(100, 100, 150) },
            { id: 7, name: '记忆圣殿', desc: '守护最后的记忆', icon: '⛪', color: new Color(255, 215, 100) },
            { id: 8, name: '命运交织', desc: '命运的丝线在此缠绕', icon: '🧵', color: new Color(200, 100, 200) },
            { id: 9, name: '真相浮现', desc: '接近最终的真相', icon: '🔍', color: new Color(100, 255, 150) },
            { id: 10, name: '最终回收', desc: '完成记忆的回收', icon: '👑', color: new Color(255, 50, 100) },
        ];
        
        chapterConfigs.forEach((config, index) => {
            const chapterData: ChapterData = {
                id: config.id,
                name: config.name,
                description: config.desc,
                position: this.CHAPTER_POSITIONS[index],
                icon: config.icon,
                themeColor: config.color,
                unlockRequirement: {
                    prevChapter: config.id > 1 ? config.id - 1 : 0,
                    level: 1 + index * 5
                },
                isUnlocked: config.id === 1,  // 第一章默认解锁
                isCompleted: false,
                stars: 0,
                maxStars: 15  // 每章3关×5星
            };
            
            this.chapters.set(config.id, chapterData);
        });
        
        // 设置路线连接
        this.routes = [];
        for (let i = 1; i < 10; i++) {
            this.routes.push({
                from: i,
                to: i + 1,
                path: this.generateRoutePath(
                    this.CHAPTER_POSITIONS[i - 1],
                    this.CHAPTER_POSITIONS[i]
                )
            });
        }
    }
    
    /**
     * 生成路线路径点（曲线）
     */
    private generateRoutePath(from: Vec3, to: Vec3): Vec3[] {
        const path: Vec3[] = [];
        const midY = (from.y + to.y) / 2;
        const controlX = (from.x + to.x) / 2 + (Math.random() * 100 - 50);
        
        // 贝塞尔曲线采样
        for (let t = 0; t <= 1; t += 0.1) {
            const invT = 1 - t;
            const x = invT * invT * from.x + 2 * invT * t * controlX + t * t * to.x;
            const y = invT * invT * from.y + 2 * invT * t * midY + t * t * to.y;
            path.push(new Vec3(x, y, 0));
        }
        
        return path;
    }
    
    /**
     * 加载章节数据（从存档）
     */
    private loadChapterData() {
        const player = playerDataManager.getPlayerData();
        
        this.chapters.forEach((chapter) => {
            // 检查解锁状态
            if (chapter.id > 1) {
                const prevChapter = this.chapters.get(chapter.id - 1);
                chapter.isUnlocked = prevChapter?.isCompleted || false;
            }
            
            // 检查完成状态（根据玩家进度）
            chapter.isCompleted = player.currentChapter > chapter.id;
            
            // 计算星星数
            // chapter.stars = player.getChapterStars(chapter.id);
        });
    }
    
    /**
     * 渲染世界地图
     */
    private renderWorldMap() {
        this.clearMap();
        
        // 渲染路线
        this.renderRoutes();
        
        // 渲染章节节点
        this.renderChapters();
        
        // 添加装饰元素
        this.addDecorations();
        
        // 添加云层
        this.addClouds();
    }
    
    /**
     * 渲染路线
     */
    private renderRoutes() {
        if (!this.routeLayer) return;
        
        const graphics = this.routeLayer.getComponent(Graphics);
        if (!graphics) return;
        
        graphics.clear();
        
        this.routes.forEach((route) => {
            const fromChapter = this.chapters.get(route.from);
            const toChapter = this.chapters.get(route.to);
            
            if (!fromChapter || !toChapter) return;
            
            // 设置路线样式
            if (fromChapter.isCompleted && toChapter.isUnlocked) {
                graphics.strokeColor = new Color(100, 255, 100, 200);
                graphics.lineWidth = 4;
            } else if (fromChapter.isUnlocked) {
                graphics.strokeColor = new Color(255, 255, 255, 100);
                graphics.lineWidth = 2;
            } else {
                graphics.strokeColor = new Color(100, 100, 100, 80);
                graphics.lineWidth = 2;
            }
            
            // 绘制路径
            if (route.path.length > 0) {
                graphics.moveTo(route.path[0].x, route.path[0].y);
                for (let i = 1; i < route.path.length; i++) {
                    graphics.lineTo(route.path[i].x, route.path[i].y);
                }
                graphics.stroke();
            }
            
            // 已解锁路线上的流动效果
            if (fromChapter.isCompleted && toChapter.isUnlocked) {
                this.createRouteFlowEffect(route);
            }
        });
    }
    
    /**
     * 创建路线流动效果
     */
    private createRouteFlowEffect(route: ChapterRoute) {
        if (!this.routeLayer || route.path.length < 2) return;
        
        const flowNode = new Node('RouteFlow');
        const sprite = flowNode.addComponent(Sprite);
        sprite.color = new Color(255, 255, 150);
        
        flowNode.setScale(0.2, 0.2, 1);
        this.routeLayer.addChild(flowNode);
        
        // 沿路径移动
        let currentIndex = 0;
        const moveToNext = () => {
            if (currentIndex >= route.path.length - 1) {
                currentIndex = 0;
            }
            
            const start = route.path[currentIndex];
            const end = route.path[currentIndex + 1] || route.path[0];
            
            tween(flowNode)
                .to(0.5, { position: end })
                .call(() => {
                    currentIndex++;
                    moveToNext();
                })
                .start();
        };
        
        flowNode.setPosition(route.path[0]);
        moveToNext();
    }
    
    /**
     * 渲染章节节点
     */
    private renderChapters() {
        if (!this.chapterLayer) return;
        
        this.chapters.forEach((chapter) => {
            const node = this.createChapterNode(chapter);
            this.chapterNodes.set(chapter.id, node);
            this.chapterLayer!.addChild(node);
        });
    }
    
    /**
     * 创建章节节点
     */
    private createChapterNode(chapter: ChapterData): Node {
        const node = instantiate(this.chapterNodePrefab) || new Node(`Chapter_${chapter.id}`);
        
        // 设置位置
        node.setPosition(chapter.position);
        
        // 设置大小（根据章节重要性）
        const baseSize = 1;
        const sizeMultiplier = chapter.id === 10 ? 1.5 : (chapter.id % 5 === 0 ? 1.3 : 1);
        node.setScale(baseSize * sizeMultiplier, baseSize * sizeMultiplier, 1);
        
        // 创建视觉元素
        this.setupChapterVisuals(node, chapter);
        
        // 添加点击事件
        node.on(Node.EventType.TOUCH_END, () => {
            this.onChapterClick(chapter);
        }, this);
        
        // 根据状态播放动画
        if (chapter.isUnlocked && !chapter.isCompleted) {
            this.playCurrentChapterAnimation(node, chapter);
        }
        
        return node;
    }
    
    /**
     * 设置章节视觉
     */
    private setupChapterVisuals(node: Node, chapter: ChapterData) {
        // 背景圆形
        const bgNode = new Node('Background');
        const bgSprite = bgNode.addComponent(Sprite);
        bgSprite.color = chapter.isUnlocked ? chapter.themeColor : new Color(80, 80, 80);
        
        // 调整大小
        const size = chapter.isCompleted ? 80 : (chapter.isUnlocked ? 90 : 70);
        bgNode.setScale(size / 60, size / 60, 1);
        
        node.addChild(bgNode);
        
        // 图标
        const iconNode = new Node('Icon');
        const iconLabel = iconNode.addComponent(Label);
        iconLabel.string = chapter.icon;
        iconLabel.fontSize = 40;
        node.addChild(iconNode);
        
        // 章节编号
        const numNode = new Node('Number');
        const numLabel = numNode.addComponent(Label);
        numLabel.string = `${chapter.id}`;
        numLabel.fontSize = 20;
        numLabel.color = new Color(255, 255, 255);
        numNode.setPosition(0, -40, 0);
        node.addChild(numNode);
        
        // 锁图标（未解锁）
        if (!chapter.isUnlocked) {
            const lockNode = new Node('Lock');
            const lockLabel = lockNode.addComponent(Label);
            lockLabel.string = '🔒';
            lockLabel.fontSize = 30;
            lockNode.setPosition(25, 25, 0);
            node.addChild(lockNode);
        }
        
        // 完成标记
        if (chapter.isCompleted) {
            const checkNode = new Node('Complete');
            const checkLabel = checkNode.addComponent(Label);
            checkLabel.string = '✓';
            checkLabel.fontSize = 30;
            checkLabel.color = new Color(100, 255, 100);
            checkNode.setPosition(30, 30, 0);
            node.addChild(checkNode);
        }
        
        // 星星显示
        if (chapter.stars > 0) {
            const starNode = new Node('Stars');
            const starLabel = starNode.addComponent(Label);
            starLabel.string = '⭐'.repeat(chapter.stars);
            starLabel.fontSize = 16;
            starNode.setPosition(0, 50, 0);
            node.addChild(starNode);
        }
    }
    
    /**
     * 当前章节动画（未完成的已解锁章节）
     */
    private playCurrentChapterAnimation(node: Node, chapter: ChapterData) {
        // 脉冲效果
        tween(node)
            .to(1, { scale: new Vec3(1.1, 1.1, 1) }, { easing: 'sineInOut' })
            .to(1, { scale: new Vec3(1, 1, 1) }, { easing: 'sineInOut' })
            .union()
            .repeatForever()
            .start();
        
        // 光晕效果
        const glowNode = new Node('Glow');
        const glowSprite = glowNode.addComponent(Sprite);
        glowSprite.color = new Color(chapter.themeColor.r, chapter.themeColor.g, chapter.themeColor.b, 100);
        glowNode.setScale(1.5, 1.5, 1);
        node.insertChild(glowNode, 0);
        
        tween(glowNode)
            .to(1.5, { scale: new Vec3(1.8, 1.8, 1) })
            .to(1.5, { scale: new Vec3(1.5, 1.5, 1) })
            .union()
            .repeatForever()
            .start();
    }
    
    /**
     * 章节点击处理
     */
    private onChapterClick(chapter: ChapterData) {
        this.selectedChapterId = chapter.id;
        
        // 高亮选中
        this.highlightSelectedChapter(chapter.id);
        
        // 显示信息
        this.showChapterInfo(chapter);
    }
    
    /**
     * 高亮选中章节
     */
    private highlightSelectedChapter(chapterId: number) {
        this.chapterNodes.forEach((node, id) => {
            if (id === chapterId) {
                tween(node)
                    .to(0.2, { scale: new Vec3(1.2, 1.2, 1) })
                    .start();
            } else {
                const chapter = this.chapters.get(id);
                const baseScale = chapter?.id === 10 ? 1.5 : (chapter!.id % 5 === 0 ? 1.3 : 1);
                tween(node)
                    .to(0.2, { scale: new Vec3(baseScale, baseScale, 1) })
                    .start();
            }
        });
    }
    
    /**
     * 显示章节信息
     */
    private showChapterInfo(chapter: ChapterData) {
        if (!this.chapterInfoPanel) return;
        
        this.chapterInfoPanel.active = true;
        
        if (this.chapterNameLabel) {
            this.chapterNameLabel.string = chapter.name;
            this.chapterNameLabel.color = chapter.themeColor;
        }
        
        if (this.chapterDescLabel) {
            this.chapterDescLabel.string = chapter.description;
        }
        
        if (this.chapterProgressLabel) {
            this.chapterProgressLabel.string = `进度: ${chapter.stars}/${chapter.maxStars} ⭐`;
        }
        
        // 更新开始按钮状态
        if (this.startButton) {
            this.startButton.active = chapter.isUnlocked;
        }
        
        // 更新锁定显示
        if (this.lockOverlay) {
            this.lockOverlay.active = !chapter.isUnlocked;
        }
    }
    
    /**
     * 添加装饰元素
     */
    private addDecorations() {
        if (!this.decorationLayer) return;
        
        // 添加漂浮的记忆碎片
        for (let i = 0; i < 10; i++) {
            const fragment = new Node(`Fragment_${i}`);
            const sprite = fragment.addComponent(Sprite);
            sprite.color = new Color(255, 255, 200, 150);
            
            // 随机位置
            const x = Math.random() * 600 - 300;
            const y = Math.random() * 1600 - 400;
            fragment.setPosition(x, y, 0);
            
            // 随机大小
            const scale = 0.2 + Math.random() * 0.3;
            fragment.setScale(scale, scale, 1);
            
            this.decorationLayer.addChild(fragment);
            
            // 漂浮动画
            tween(fragment)
                .by(3 + Math.random() * 2, { 
                    position: new Vec3(Math.random() * 50 - 25, 50 + Math.random() * 50, 0) 
                })
                .by(3 + Math.random() * 2, { 
                    position: new Vec3(Math.random() * 50 - 25, -50 - Math.random() * 50, 0) 
                })
                .union()
                .repeatForever()
                .start();
        }
    }
    
    /**
     * 添加云层
     */
    private addClouds() {
        if (!this.cloudLayer) return;
        
        for (let i = 0; i < 5; i++) {
            const cloud = new Node(`Cloud_${i}`);
            const sprite = cloud.addComponent(Sprite);
            sprite.color = new Color(255, 255, 255, 80);
            
            cloud.setPosition(-400 - i * 100, 200 + Math.random() * 400, 0);
            cloud.setScale(2 + Math.random(), 1 + Math.random() * 0.5, 1);
            
            this.cloudLayer.addChild(cloud);
            
            // 缓慢移动
            tween(cloud)
                .to(40 + i * 10, { position: new Vec3(500, cloud.position.y, 0) })
                .call(() => {
                    cloud.setPosition(-400, cloud.position.y, 0);
                })
                .repeatForever()
                .start();
        }
    }
    
    /**
     * 播放入场动画
     */
    private playEntryAnimation() {
        // 章节节点依次出现
        let delay = 0;
        this.chapterNodes.forEach((node) => {
            node.setScale(0, 0, 1);
            tween(node)
                .delay(delay)
                .to(0.3, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
                .start();
            delay += 0.1;
        });
        
        // 镜头从底部移动到当前章节
        if (this.mapContainer) {
            const currentChapter = this.getCurrentChapter();
            if (currentChapter) {
                const targetY = -currentChapter.position.y + 200;
                this.mapContainer.setPosition(0, -500, 0);
                tween(this.mapContainer)
                    .delay(0.5)
                    .to(1, { position: new Vec3(0, targetY, 0) }, { easing: 'quadOut' })
                    .start();
            }
        }
    }
    
    /**
     * 获取当前章节（已解锁但未完成的）
     */
    private getCurrentChapter(): ChapterData | undefined {
        for (const [id, chapter] of this.chapters) {
            if (chapter.isUnlocked && !chapter.isCompleted) {
                return chapter;
            }
        }
        return this.chapters.get(1);
    }
    
    /**
     * 清空地图
     */
    private clearMap() {
        this.chapterNodes.clear();
        
        if (this.routeLayer) {
            this.routeLayer.getComponent(Graphics)?.clear();
            this.routeLayer.removeAllChildren();
        }
        if (this.chapterLayer) {
            this.chapterLayer.removeAllChildren();
        }
        if (this.decorationLayer) {
            this.decorationLayer.removeAllChildren();
        }
        if (this.cloudLayer) {
            this.cloudLayer.removeAllChildren();
        }
    }
    
    // ============ UI按钮 ============
    
    public onStartChapterClick() {
        if (this.selectedChapterId === null) return;
        
        const chapter = this.chapters.get(this.selectedChapterId);
        if (!chapter || !chapter.isUnlocked) return;
        
        // 保存当前章节
        playerDataManager.updatePlayerData({ currentChapter: chapter.id });
        
        // 切换到探险场景
        sceneManager.switchTo(GameScene.ADVENTURE, true);
    }
    
    public onCloseInfoClick() {
        if (this.chapterInfoPanel) {
            this.chapterInfoPanel.active = false;
        }
        this.selectedChapterId = null;
    }
    
    public onScrollUp() {
        if (this.mapContainer) {
            const currentY = this.mapContainer.position.y;
            tween(this.mapContainer)
                .to(0.5, { position: new Vec3(0, currentY + 300, 0) }, { easing: 'quadOut' })
                .start();
        }
    }
    
    public onScrollDown() {
        if (this.mapContainer) {
            const currentY = this.mapContainer.position.y;
            tween(this.mapContainer)
                .to(0.5, { position: new Vec3(0, currentY - 300, 0) }, { easing: 'quadOut' })
                .start();
        }
    }
    
    public onBackClick() {
        sceneManager.switchTo(GameScene.CITY);
    }
}
