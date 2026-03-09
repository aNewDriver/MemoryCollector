/**
 * 爬塔地图系统
 * 参考：杀戮尖塔的地图选择机制
 * 核心玩法：玩家在多层塔中选择路径，每层有不同事件
 */

export enum RoomType {
    BATTLE = 'battle',      // 普通战斗
    ELITE = 'elite',        // 精英战斗
    BOSS = 'boss',          // Boss战
    REST = 'rest',          // 休息处（回血/升级卡牌）
    SHOP = 'shop',          // 商店
    EVENT = 'event',        // 随机事件
    TREASURE = 'treasure',  // 宝箱
    UNKNOWN = 'unknown'     // 未知房间（迷雾）
}

export interface Room {
    id: string;
    type: RoomType;
    x: number;              // 在地图上的X位置
    y: number;              // 在地图上的Y位置（层数）
    connections: string[];  // 可连接的下层房间ID
    visited: boolean;
    cleared: boolean;
    // 房间特定数据
    data?: {
        enemyIds?: string[];     // 战斗房间的敌人
        eventId?: string;        // 事件房间的事件ID
        treasureId?: string;     // 宝箱房间的奖励ID
        shopItems?: ShopItem[];  // 商店商品
    };
}

export interface ShopItem {
    id: string;
    type: 'card' | 'relic' | 'consumable';
    itemId: string;
    price: number;
    sold: boolean;
}

export interface TowerMap {
    id: string;
    name: string;
    description: string;
    floors: number;         // 总层数
    currentFloor: number;   // 当前层
    rooms: Map<string, Room>;
    startRoomId: string;
    bossRoomId: string;
    // 地图生成配置
    config: TowerMapConfig;
}

export interface TowerMapConfig {
    floorWidth: number;     // 每层宽度（房间数）
    minConnections: number; // 最小连接数
    maxConnections: number; // 最大连接数
    roomWeights: {          // 房间类型权重
        [key in RoomType]?: number;
    };
}

// 默认地图配置
export const DEFAULT_MAP_CONFIG: TowerMapConfig = {
    floorWidth: 5,
    minConnections: 1,
    maxConnections: 3,
    roomWeights: {
        [RoomType.BATTLE]: 40,
        [RoomType.ELITE]: 15,
        [RoomType.REST]: 10,
        [RoomType.SHOP]: 10,
        [RoomType.EVENT]: 15,
        [RoomType.TREASURE]: 5,
        [RoomType.UNKNOWN]: 5
    }
};

// 章节配置
export const CHAPTER_TOWER_CONFIGS: { [key: number]: Partial<TowerMapConfig> } = {
    1: { // 第一章：相对简单
        floorWidth: 4,
        roomWeights: {
            [RoomType.BATTLE]: 50,
            [RoomType.ELITE]: 10,
            [RoomType.REST]: 15,
            [RoomType.SHOP]: 10,
            [RoomType.EVENT]: 10,
            [RoomType.TREASURE]: 5
        }
    },
    2: { // 第二章：增加精英战
        floorWidth: 5,
        roomWeights: {
            [RoomType.BATTLE]: 40,
            [RoomType.ELITE]: 20,
            [RoomType.REST]: 10,
            [RoomType.SHOP]: 10,
            [RoomType.EVENT]: 12,
            [RoomType.TREASURE]: 5,
            [RoomType.UNKNOWN]: 3
        }
    },
    3: { // 第三章：更多未知和事件
        floorWidth: 6,
        roomWeights: {
            [RoomType.BATTLE]: 35,
            [RoomType.ELITE]: 20,
            [RoomType.REST]: 8,
            [RoomType.SHOP]: 8,
            [RoomType.EVENT]: 15,
            [RoomType.TREASURE]: 5,
            [RoomType.UNKNOWN]: 9
        }
    },
    4: { // 第四章：高难度
        floorWidth: 6,
        roomWeights: {
            [RoomType.BATTLE]: 30,
            [RoomType.ELITE]: 25,
            [RoomType.REST]: 5,
            [RoomType.SHOP]: 5,
            [RoomType.EVENT]: 15,
            [RoomType.TREASURE]: 5,
            [RoomType.UNKNOWN]: 15
        }
    }
};

/**
 * 地图生成器
 */
export class TowerMapGenerator {
    private config: TowerMapConfig;
    private rng: () => number;

    constructor(config: TowerMapConfig = DEFAULT_MAP_CONFIG, seed?: number) {
        this.config = { ...DEFAULT_MAP_CONFIG, ...config };
        this.rng = seed !== undefined ? this.createSeededRNG(seed) : Math.random;
    }

    /**
     * 生成完整地图
     */
    generateMap(mapId: string, name: string, floors: number, chapter: number = 1): TowerMap {
        const chapterConfig = CHAPTER_TOWER_CONFIGS[chapter] || {};
        this.config = { ...this.config, ...chapterConfig };

        const rooms = new Map<string, Room>();
        let startRoomId = '';
        let bossRoomId = '';

        // 生成每一层的房间
        for (let floor = 0; floor < floors; floor++) {
            const isFirstFloor = floor === 0;
            const isBossFloor = floor === floors - 1;
            const roomCount = isFirstFloor || isBossFloor ? 1 : this.config.floorWidth;

            for (let x = 0; x < roomCount; x++) {
                const roomId = `room_${floor}_${x}`;
                let roomType: RoomType;

                if (isFirstFloor) {
                    roomType = RoomType.BATTLE; // 第一层固定为普通战斗
                    startRoomId = roomId;
                } else if (isBossFloor) {
                    roomType = RoomType.BOSS; // 最后一层固定为Boss
                    bossRoomId = roomId;
                } else {
                    roomType = this.randomRoomType();
                }

                const room: Room = {
                    id: roomId,
                    type: roomType,
                    x: x,
                    y: floor,
                    connections: [],
                    visited: false,
                    cleared: false,
                    data: this.generateRoomData(roomType, floor, chapter)
                };

                rooms.set(roomId, room);
            }
        }

        // 建立房间连接
        this.connectRooms(rooms, floors);

        return {
            id: mapId,
            name,
            description: `第${chapter}章：${name}`,
            floors,
            currentFloor: 0,
            rooms,
            startRoomId,
            bossRoomId,
            config: this.config
        };
    }

    /**
     * 随机选择房间类型
     */
    private randomRoomType(): RoomType {
        const weights = this.config.roomWeights;
        const totalWeight = Object.values(weights).reduce((a, b) => (a || 0) + (b || 0), 0);
        let random = this.rng() * (totalWeight || 100);

        for (const [type, weight] of Object.entries(weights)) {
            random -= weight || 0;
            if (random <= 0) {
                return type as RoomType;
            }
        }

        return RoomType.BATTLE;
    }

    /**
     * 建立房间连接
     */
    private connectRooms(rooms: Map<string, Room>, floors: number): void {
        for (let floor = 0; floor < floors - 1; floor++) {
            const currentFloorRooms = Array.from(rooms.values()).filter(r => r.y === floor);
            const nextFloorRooms = Array.from(rooms.values()).filter(r => r.y === floor + 1);

            for (const currentRoom of currentFloorRooms) {
                // 随机选择1-3个下层房间连接
                const connectionCount = Math.floor(this.rng() * 
                    (this.config.maxConnections - this.config.minConnections + 1)) + 
                    this.config.minConnections;
                
                const availableRooms = [...nextFloorRooms];
                for (let i = 0; i < Math.min(connectionCount, availableRooms.length); i++) {
                    const randomIndex = Math.floor(this.rng() * availableRooms.length);
                    const targetRoom = availableRooms.splice(randomIndex, 1)[0];
                    
                    if (!currentRoom.connections.includes(targetRoom.id)) {
                        currentRoom.connections.push(targetRoom.id);
                    }
                }
            }
        }
    }

    /**
     * 生成房间特定数据
     */
    private generateRoomData(type: RoomType, floor: number, chapter: number): any {
        switch (type) {
            case RoomType.BATTLE:
            case RoomType.ELITE:
                return {
                    enemyIds: this.generateEnemies(type, floor, chapter)
                };
            case RoomType.EVENT:
                return {
                    eventId: `event_${chapter}_${floor}_${Math.floor(this.rng() * 10)}`
                };
            case RoomType.TREASURE:
                return {
                    treasureId: `treasure_${chapter}_${floor}_${Math.floor(this.rng() * 5)}`
                };
            case RoomType.SHOP:
                return {
                    shopItems: this.generateShopItems(floor, chapter)
                };
            default:
                return {};
        }
    }

    /**
     * 生成敌人列表
     */
    private generateEnemies(type: RoomType, floor: number, chapter: number): string[] {
        const count = type === RoomType.ELITE ? 1 : Math.floor(this.rng() * 2) + 1;
        const enemies: string[] = [];
        
        for (let i = 0; i < count; i++) {
            const enemyTier = Math.min(chapter, 4);
            const enemyId = `enemy_ch${chapter}_t${enemyTier}_${Math.floor(this.rng() * 5)}`;
            enemies.push(enemyId);
        }
        
        return enemies;
    }

    /**
     * 生成商店商品
     */
    private generateShopItems(floor: number, chapter: number): ShopItem[] {
        const items: ShopItem[] = [];
        const itemCount = 3 + Math.floor(this.rng() * 3); // 3-5个商品

        for (let i = 0; i < itemCount; i++) {
            const type = this.rng() < 0.6 ? 'card' : (this.rng() < 0.8 ? 'consumable' : 'relic');
            const price = 50 + Math.floor(this.rng() * 100) + (floor * 10);
            
            items.push({
                id: `shop_item_${floor}_${i}`,
                type,
                itemId: `${type}_${chapter}_${Math.floor(this.rng() * 20)}`,
                price,
                sold: false
            });
        }

        return items;
    }

    /**
     * 创建带种子的随机数生成器
     */
    private createSeededRNG(seed: number): () => number {
        return () => {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
    }
}

/**
 * 地图管理器
 */
export class TowerMapManager {
    private currentMap: TowerMap | null = null;
    private visitedRooms: Set<string> = new Set();
    private pathHistory: string[] = [];

    /**
     * 创建新地图
     */
    createNewMap(chapter: number, seed?: number): TowerMap {
        const generator = new TowerMapGenerator(undefined, seed);
        const chapterNames = [
            '记忆迷宫',
            '遗忘之境', 
            '深海回忆',
            '愤怒火山'
        ];
        
        this.currentMap = generator.generateMap(
            `map_ch${chapter}_${Date.now()}`,
            chapterNames[chapter - 1] || '未知领域',
            12 + chapter * 2, // 每章增加层数
            chapter
        );
        
        this.visitedRooms.clear();
        this.pathHistory = [this.currentMap.startRoomId];
        
        return this.currentMap;
    }

    /**
     * 获取当前房间
     */
    getCurrentRoom(): Room | null {
        if (!this.currentMap || this.pathHistory.length === 0) return null;
        const currentId = this.pathHistory[this.pathHistory.length - 1];
        return this.currentMap.rooms.get(currentId) || null;
    }

    /**
     * 移动到指定房间
     */
    moveToRoom(roomId: string): boolean {
        if (!this.currentMap) return false;
        
        const currentRoom = this.getCurrentRoom();
        if (!currentRoom || !currentRoom.connections.includes(roomId)) {
            return false; // 无法直接移动到未连接的房间
        }

        const targetRoom = this.currentMap.rooms.get(roomId);
        if (!targetRoom) return false;

        this.pathHistory.push(roomId);
        this.visitedRooms.add(roomId);
        targetRoom.visited = true;
        this.currentMap.currentFloor = targetRoom.y;

        return true;
    }

    /**
     * 获取可移动的房间
     */
    getAvailableMoves(): Room[] {
        const currentRoom = this.getCurrentRoom();
        if (!currentRoom || !this.currentMap) return [];

        return currentRoom.connections
            .map(id => this.currentMap!.rooms.get(id))
            .filter((room): room is Room => room !== undefined);
    }

    /**
     * 完成当前房间
     */
    clearCurrentRoom(): void {
        const currentRoom = this.getCurrentRoom();
        if (currentRoom) {
            currentRoom.cleared = true;
        }
    }

    /**
     * 是否到达Boss房间
     */
    isAtBossRoom(): boolean {
        if (!this.currentMap) return false;
        const currentRoom = this.getCurrentRoom();
        return currentRoom?.id === this.currentMap.bossRoomId;
    }

    /**
     * 获取地图进度百分比
     */
    getProgress(): number {
        if (!this.currentMap) return 0;
        return (this.currentMap.currentFloor / (this.currentMap.floors - 1)) * 100;
    }

    /**
     * 获取当前地图
     */
    getCurrentMap(): TowerMap | null {
        return this.currentMap;
    }

    /**
     * 获取路径历史
     */
    getPathHistory(): string[] {
        return [...this.pathHistory];
    }
}

// 导出单例
export const towerMapManager = new TowerMapManager();
