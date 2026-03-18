/**
 * 爬塔地图可视化系统
 * 类似杀戮尖塔的节点地图，带连接线和动画效果
 */

import { 
    _decorator, Component, Node, Graphics, Vec3, Color, 
    tween, Sprite, Label, UITransform, Vec2, instantiate, 
    Prefab, Animation, AnimationClip, easing, UIOpacity 
} from 'cc';
import { EnhancedScene } from '../base/EnhancedScene';
import { 
    TowerMap, Room, RoomType, TowerMapGenerator, 
    DEFAULT_MAP_CONFIG, CHAPTER_TOWER_CONFIGS 
} from '../../map/TowerMapSystem';
import { GameScene, sceneManager } from '../../core/SceneManager';

const { ccclass, property } = _decorator;

// 房间节点UI数据
interface RoomNodeUI {
    room: Room;
    node: Node;
    iconSprite: Sprite;
    label: Label;
    connectionLines: Graphics[];
    isReachable: boolean;  // 是否可从当前位置到达
}

// 房间视觉配置
const ROOM_VISUALS: { [key in RoomType]: { icon: string; color: Color; size: number } } = {
    [RoomType.BATTLE]:   { icon: '⚔️', color: new Color(200, 100, 100), size: 60 },
    [RoomType.ELITE]:    { icon: '👹', color: new Color(255, 100, 50), size: 70 },
    [RoomType.BOSS]:     { icon: '☠️', color: new Color(255, 50, 50), size: 90 },
    [RoomType.REST]:     { icon: '🔥', color: new Color(100, 200, 100), size: 60 },
    [RoomType.SHOP]:     { icon: '🏪', color: new Color(255, 200, 100), size: 60 },
    [RoomType.EVENT]:    { icon: '❓', color: new Color(200, 150, 255), size: 60 },
    [RoomType.TREASURE]: { icon: '💎', color: new Color(255, 215, 0), size: 60 },
    [RoomType.UNKNOWN]:  { icon: '🌫️', color: new Color(150, 150, 150), size: 60 }
};

@ccclass('TowerMapEnhanced')
export class TowerMapEnhanced extends EnhancedScene {
    
    // ============ 地图数据 ============
    private towerMap: TowerMap | null = null;
    private currentRoomId: string = '';
    private roomNodes: Map<string, RoomNodeUI> = new Map();
    
    // ============ 节点预制体 ============
    @property(Prefab)
    private roomNodePrefab: Prefab | null = null;
    
    @property(Prefab)
    private playerTokenPrefab: Prefab | null = null;
    
    // ============ 容器节点 ============
    @property(Node)
    private mapContainer: Node | null = null;
    
    @property(Node)
    private connectionLayer: Node | null = null;
    
    @property(Node)
    private roomLayer: Node | null = null;
    
    @property(Node)
    private playerLayer: Node | null = null;
    
    // ============ UI元素 ============
    @property(Node)
    private mapInfoPanel: Node | null = null;
    
    @property(Label)
    private mapNameLabel: Label | null = null;
    
    @property(Label)
    private floorProgressLabel: Label | null = null;
    
    @property(Label)
    private roomInfoLabel: Label | null = null;
    
    @property(Node)
    private legendPanel: Node | null = null;
    
    // ============ 配置 ============
    private readonly NODE_SPACING_X = 100;  // 水平间距
    private readonly NODE_SPACING_Y = 120;  // 层间距
    private readonly MAP_OFFSET_Y = 400;    // 起始Y偏移
    
    // 玩家标记
    private playerToken: Node | null = null;
    
    onLoad() {
        super.onLoad();
        this.initMapScene();
    }
    
    /**
     * 初始化地图场景
     */
    private initMapScene() {
        // 应用场景配置
        this.applySceneConfig({
            id: 'tower_map',
            name: '无尽回廊',
            backgroundImage: 'scenes/tower/tower_map_bg.png',
            bgm: 'bgm_tower_exploration',
            lighting: 'mysterious',
            ambientEffect: 'floating_lanterns'
        });
    }
    
    /**
     * 加载地图
     */
    public loadTowerMap(chapter: number = 1, seed?: number) {
        const config = CHAPTER_TOWER_CONFIGS[chapter] || DEFAULT_MAP_CONFIG;
        const generator = new TowerMapGenerator({ ...DEFAULT_MAP_CONFIG, ...config }, seed);
        
        this.towerMap = generator.generateMap(
            `chapter_${chapter}`,
            `第${chapter}章：无尽回廊`,
            15,  // 15层
            chapter
        );
        
        this.currentRoomId = this.towerMap.startRoomId;
        
        // 渲染地图
        this.renderMap();
        this.updateMapInfo();
    }
    
    /**
     * 渲染地图
     */
    private renderMap() {
        if (!this.towerMap) return;
        
        // 清空现有内容
        this.clearMap();
        
        // 先渲染连接线
        this.renderConnections();
        
        // 再渲染房间节点
        this.renderRooms();
        
        // 创建玩家标记
        this.createPlayerToken();
        
        // 滚动到当前位置
        this.scrollToCurrentFloor();
    }
    
    /**
     * 渲染房间节点
     */
    private renderRooms() {
        if (!this.towerMap || !this.roomLayer) return;
        
        this.towerMap.rooms.forEach((room) => {
            const roomUI = this.createRoomNode(room);
            this.roomNodes.set(room.id, roomUI);
            this.roomLayer!.addChild(roomUI.node);
        });
    }
    
    /**
     * 创建房间节点
     */
    private createRoomNode(room: Room): RoomNodeUI {
        const visual = ROOM_VISUALS[room.type];
        
        // 创建或使用预制体
        const node = instantiate(this.roomNodePrefab) || new Node(`Room_${room.id}`);
        
        // 设置位置
        const x = (room.x - 2) * this.NODE_SPACING_X;
        const y = this.MAP_OFFSET_Y - room.y * this.NODE_SPACING_Y;
        node.setPosition(x, y, 0);
        
        // 设置大小
        const size = visual.size;
        node.setScale(size / 60, size / 60, 1);
        
        // 创建视觉元素
        this.setupRoomVisuals(node, room, visual);
        
        // 检查是否可达
        const isReachable = this.isRoomReachable(room);
        
        // 设置状态
        this.updateRoomState(node, room, isReachable);
        
        // 添加点击事件
        if (isReachable && !room.visited) {
            node.on(Node.EventType.TOUCH_END, () => {
                this.onRoomClick(room);
            }, this);
        }
        
        return {
            room,
            node,
            iconSprite: node.getComponent(Sprite)!,
            label: node.getComponentInChildren(Label)!,
            connectionLines: [],
            isReachable
        };
    }
    
    /**
     * 设置房间视觉
     */
    private setupRoomVisuals(node: Node, room: Room, visual: { icon: string; color: Color; size: number }) {
        // 背景圆形
        const bgNode = new Node('Background');
        const bgSprite = bgNode.addComponent(Sprite);
        bgSprite.color = visual.color;
        bgNode.setScale(1, 1, 1);
        node.addChild(bgNode);
        
        // 图标
        const iconNode = new Node('Icon');
        const iconLabel = iconNode.addComponent(Label);
        iconLabel.string = visual.icon;
        iconLabel.fontSize = 36;
        iconLabel.color = new Color(255, 255, 255);
        iconNode.setPosition(0, 0, 0);
        node.addChild(iconNode);
        
        // 状态指示器（已完成/可进入）
        const indicatorNode = new Node('Indicator');
        const indicatorSprite = indicatorNode.addComponent(Sprite);
        indicatorNode.setPosition(0, -35, 0);
        indicatorNode.setScale(0.3, 0.3, 1);
        node.addChild(indicatorNode);
    }
    
    /**
     * 更新房间状态
     */
    private updateRoomState(node: Node, room: Room, isReachable: boolean) {
        const bgNode = node.getChildByName('Background');
        const indicatorNode = node.getChildByName('Indicator');
        
        if (room.visited) {
            // 已访问 - 变灰
            if (bgNode) {
                bgNode.getComponent(Sprite)!.color = new Color(100, 100, 100);
            }
            if (indicatorNode) {
                indicatorNode.getComponent(Sprite)!.color = new Color(100, 255, 100);
                indicatorNode.active = true;
            }
            node.setScale(0.8, 0.8, 1);
        } else if (isReachable) {
            // 可进入 - 发光效果
            if (indicatorNode) {
                indicatorNode.getComponent(Sprite)!.color = new Color(255, 255, 100);
                indicatorNode.active = true;
            }
            this.playPulseAnimation(node);
        } else {
            // 不可达 - 半透明
            node.getComponent(UIOpacity)!.opacity = 100;
            if (indicatorNode) {
                indicatorNode.active = false;
            }
        }
        
        // 当前所在房间特殊标记
        if (room.id === this.currentRoomId) {
            this.playCurrentRoomAnimation(node);
        }
    }
    
    /**
     * 播放脉冲动画（可进入房间）
     */
    private playPulseAnimation(node: Node) {
        const bgNode = node.getChildByName('Background');
        if (!bgNode) return;
        
        tween(bgNode)
            .to(0.8, { scale: new Vec3(1.1, 1.1, 1) }, { easing: 'sineInOut' })
            .to(0.8, { scale: new Vec3(1, 1, 1) }, { easing: 'sineInOut' })
            .union()
            .repeatForever()
            .start();
    }
    
    /**
     * 当前房间动画
     */
    private playCurrentRoomAnimation(node: Node) {
        const indicatorNode = node.getChildByName('Indicator');
        if (indicatorNode) {
            indicatorNode.getComponent(Sprite)!.color = new Color(255, 215, 0);
            
            tween(indicatorNode)
                .to(0.5, { scale: new Vec3(0.5, 0.5, 1) })
                .to(0.5, { scale: new Vec3(0.3, 0.3, 1) })
                .union()
                .repeatForever()
                .start();
        }
    }
    
    /**
     * 渲染连接线
     */
    private renderConnections() {
        if (!this.towerMap || !this.connectionLayer) return;
        
        const graphics = this.connectionLayer.getComponent(Graphics);
        if (!graphics) return;
        
        graphics.clear();
        
        this.towerMap.rooms.forEach((room) => {
            room.connections.forEach((targetId) => {
                const targetRoom = this.towerMap!.rooms.get(targetId);
                if (targetRoom) {
                    this.drawConnection(graphics, room, targetRoom);
                }
            });
        });
    }
    
    /**
     * 绘制连接线
     */
    private drawConnection(graphics: Graphics, from: Room, to: Room) {
        const fromX = (from.x - 2) * this.NODE_SPACING_X;
        const fromY = this.MAP_OFFSET_Y - from.y * this.NODE_SPACING_Y;
        const toX = (to.x - 2) * this.NODE_SPACING_X;
        const toY = this.MAP_OFFSET_Y - to.y * this.NODE_SPACING_Y;
        
        // 判断连接状态
        const isVisited = from.visited && to.visited;
        const isReachable = from.visited && !to.visited;
        
        // 设置线条样式
        if (isVisited) {
            graphics.strokeColor = new Color(100, 255, 100, 150);
        } else if (isReachable) {
            graphics.strokeColor = new Color(255, 255, 100, 200);
        } else {
            graphics.strokeColor = new Color(100, 100, 100, 100);
        }
        
        graphics.lineWidth = isReachable ? 4 : 2;
        
        // 绘制贝塞尔曲线连接
        const midY = (fromY + toY) / 2;
        graphics.moveTo(fromX, fromY - 30);
        graphics.bezierCurveTo(
            fromX, midY,
            toX, midY,
            toX, toY + 30
        );
        graphics.stroke();
    }
    
    /**
     * 创建玩家标记
     */
    private createPlayerToken() {
        if (!this.playerLayer) return;
        
        this.playerToken = instantiate(this.playerTokenPrefab) || new Node('PlayerToken');
        
        if (!this.playerTokenPrefab) {
            // 创建默认玩家标记
            const sprite = this.playerToken.addComponent(Sprite);
            sprite.color = new Color(100, 200, 255);
            
            const label = this.playerToken.addComponent(Label);
            label.string = '👤';
            label.fontSize = 40;
        }
        
        this.playerLayer.addChild(this.playerToken);
        this.updatePlayerTokenPosition();
    }
    
    /**
     * 更新玩家标记位置
     */
    private updatePlayerTokenPosition() {
        if (!this.playerToken || !this.towerMap) return;
        
        const currentRoom = this.towerMap.rooms.get(this.currentRoomId);
        if (!currentRoom) return;
        
        const x = (currentRoom.x - 2) * this.NODE_SPACING_X;
        const y = this.MAP_OFFSET_Y - currentRoom.y * this.NODE_SPACING_Y + 50;
        
        // 移动动画
        tween(this.playerToken)
            .to(0.5, { position: new Vec3(x, y, 0) }, { easing: 'quadOut' })
            .start();
    }
    
    /**
     * 检查房间是否可达
     */
    private isRoomReachable(room: Room): boolean {
        if (!this.towerMap) return false;
        
        // 当前房间
        if (room.id === this.currentRoomId) return true;
        
        // 已访问的房间
        if (room.visited) return true;
        
        // 检查是否有已访问的房间连接到此房间
        const currentRoom = this.towerMap.rooms.get(this.currentRoomId);
        if (currentRoom && currentRoom.connections.includes(room.id)) {
            return true;
        }
        
        return false;
    }
    
    /**
     * 房间点击处理
     */
    private onRoomClick(room: Room) {
        if (!this.isRoomReachable(room) || room.visited) return;
        
        // 显示房间信息
        this.showRoomInfo(room);
        
        // 确认进入
        this.confirmEnterRoom(room);
    }
    
    /**
     * 显示房间信息
     */
    private showRoomInfo(room: Room) {
        if (!this.roomInfoLabel) return;
        
        const roomNames: { [key in RoomType]: string } = {
            [RoomType.BATTLE]: '普通战斗',
            [RoomType.ELITE]: '精英战斗',
            [RoomType.BOSS]: '首领战',
            [RoomType.REST]: '休息处',
            [RoomType.SHOP]: '商店',
            [RoomType.EVENT]: '随机事件',
            [RoomType.TREASURE]: '宝箱',
            [RoomType.UNKNOWN]: '未知区域'
        };
        
        this.roomInfoLabel.string = `${roomNames[room.type]}\n${room.data?.eventId || ''}`;
    }
    
    /**
     * 确认进入房间
     */
    private confirmEnterRoom(room: Room) {
        // 这里应该显示确认对话框
        console.log(`准备进入: ${room.type}`);
        
        // 根据房间类型进入不同场景
        switch (room.type) {
            case RoomType.BATTLE:
            case RoomType.ELITE:
            case RoomType.BOSS:
                this.enterBattle(room);
                break;
            case RoomType.SHOP:
                this.enterShop(room);
                break;
            case RoomType.REST:
                this.enterRest(room);
                break;
            case RoomType.EVENT:
                this.enterEvent(room);
                break;
            case RoomType.TREASURE:
                this.enterTreasure(room);
                break;
        }
    }
    
    /**
     * 进入战斗
     */
    private enterBattle(room: Room) {
        // 标记房间为已访问
        room.visited = true;
        
        // 切换到战斗场景
        sceneManager.switchTo(GameScene.BATTLE, true);
        
        // 初始化战斗
        // battleManager.startTowerBattle(room);
    }
    
    private enterShop(room: Room) {
        room.visited = true;
        // UIManager.open('ShopPanel', room.data?.shopItems);
    }
    
    private enterRest(room: Room) {
        room.visited = true;
        // UIManager.open('RestPanel');
    }
    
    private enterEvent(room: Room) {
        room.visited = true;
        // UIManager.open('EventPanel', room.data?.eventId);
    }
    
    private enterTreasure(room: Room) {
        room.visited = true;
        // UIManager.open('TreasurePanel', room.data?.treasureId);
    }
    
    /**
     * 更新地图信息面板
     */
    private updateMapInfo() {
        if (!this.towerMap) return;
        
        if (this.mapNameLabel) {
            this.mapNameLabel.string = this.towerMap.name;
        }
        
        if (this.floorProgressLabel) {
            const currentFloor = this.towerMap.rooms.get(this.currentRoomId)?.y || 0;
            this.floorProgressLabel.string = `进度: ${currentFloor + 1}/${this.towerMap.floors}`;
        }
    }
    
    /**
     * 滚动到当前层
     */
    private scrollToCurrentFloor() {
        if (!this.mapContainer || !this.towerMap) return;
        
        const currentRoom = this.towerMap.rooms.get(this.currentRoomId);
        if (!currentRoom) return;
        
        const targetY = currentRoom.y * this.NODE_SPACING_Y;
        
        tween(this.mapContainer)
            .to(0.5, { position: new Vec3(0, targetY, 0) }, { easing: 'quadOut' })
            .start();
    }
    
    /**
     * 清空地图
     */
    private clearMap() {
        this.roomNodes.clear();
        
        if (this.roomLayer) {
            this.roomLayer.removeAllChildren();
        }
        if (this.connectionLayer) {
            this.connectionLayer.getComponent(Graphics)?.clear();
        }
        if (this.playerLayer) {
            this.playerLayer.removeAllChildren();
            this.playerToken = null;
        }
    }
    
    /**
     * 完成当前房间
     */
    public completeCurrentRoom() {
        const room = this.towerMap?.rooms.get(this.currentRoomId);
        if (room) {
            room.cleared = true;
        }
        
        // 重新渲染以更新连接状态
        this.renderConnections();
        this.updateRoomNodesState();
    }
    
    /**
     * 移动到指定房间
     */
    public moveToRoom(roomId: string) {
        this.currentRoomId = roomId;
        this.updatePlayerTokenPosition();
        this.updateMapInfo();
        this.updateRoomNodesState();
    }
    
    /**
     * 更新所有房间节点状态
     */
    private updateRoomNodesState() {
        this.roomNodes.forEach((roomUI) => {
            const isReachable = this.isRoomReachable(roomUI.room);
            roomUI.isReachable = isReachable;
            this.updateRoomState(roomUI.node, roomUI.room, isReachable);
        });
        
        // 重绘连接线
        if (this.connectionLayer) {
            this.renderConnections();
        }
    }
    
    // ============ UI按钮 ============
    
    public onBackClick() {
        sceneManager.goBack();
    }
    
    public onLegendToggle() {
        if (this.legendPanel) {
            this.legendPanel.active = !this.legendPanel.active;
        }
    }
    
    public onMapZoomIn() {
        if (this.mapContainer) {
            const scale = Math.min(this.mapContainer.scale.x * 1.2, 2);
            tween(this.mapContainer)
                .to(0.2, { scale: new Vec3(scale, scale, 1) })
                .start();
        }
    }
    
    public onMapZoomOut() {
        if (this.mapContainer) {
            const scale = Math.max(this.mapContainer.scale.x * 0.8, 0.5);
            tween(this.mapContainer)
                .to(0.2, { scale: new Vec3(scale, scale, 1) })
                .start();
        }
    }
}
