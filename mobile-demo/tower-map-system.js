/**
 * 爬塔地图系统 - Mobile Demo版本
 * 参考：杀戮尖塔的地图选择机制
 */

const RoomType = {
    BATTLE: 'battle',
    ELITE: 'elite',
    BOSS: 'boss',
    REST: 'rest',
    SHOP: 'shop',
    EVENT: 'event',
    TREASURE: 'treasure',
    UNKNOWN: 'unknown'
};

const DEFAULT_MAP_CONFIG = {
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

const CHAPTER_TOWER_CONFIGS = {
    1: { floorWidth: 4, roomWeights: { [RoomType.BATTLE]: 50, [RoomType.ELITE]: 10, [RoomType.REST]: 15, [RoomType.SHOP]: 10, [RoomType.EVENT]: 10, [RoomType.TREASURE]: 5 } },
    2: { floorWidth: 5, roomWeights: { [RoomType.BATTLE]: 40, [RoomType.ELITE]: 20, [RoomType.REST]: 10, [RoomType.SHOP]: 10, [RoomType.EVENT]: 12, [RoomType.TREASURE]: 5, [RoomType.UNKNOWN]: 3 } },
    3: { floorWidth: 6, roomWeights: { [RoomType.BATTLE]: 35, [RoomType.ELITE]: 20, [RoomType.REST]: 8, [RoomType.SHOP]: 8, [RoomType.EVENT]: 15, [RoomType.TREASURE]: 5, [RoomType.UNKNOWN]: 9 } },
    4: { floorWidth: 6, roomWeights: { [RoomType.BATTLE]: 30, [RoomType.ELITE]: 25, [RoomType.REST]: 5, [RoomType.SHOP]: 5, [RoomType.EVENT]: 15, [RoomType.TREASURE]: 5, [RoomType.UNKNOWN]: 15 } }
};

class TowerMapGenerator {
    constructor(config = DEFAULT_MAP_CONFIG, seed) {
        this.config = { ...DEFAULT_MAP_CONFIG, ...config };
        this.rng = seed !== undefined ? this.createSeededRNG(seed) : Math.random;
    }

    createSeededRNG(seed) {
        return () => {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
    }

    generateMap(mapId, name, floors, chapter = 1) {
        const chapterConfig = CHAPTER_TOWER_CONFIGS[chapter] || {};
        this.config = { ...this.config, ...chapterConfig };

        const rooms = new Map();
        let startRoomId = '';
        let bossRoomId = '';

        for (let floor = 0; floor < floors; floor++) {
            const isFirstFloor = floor === 0;
            const isBossFloor = floor === floors - 1;
            const roomCount = isFirstFloor || isBossFloor ? 1 : this.config.floorWidth;

            for (let x = 0; x < roomCount; x++) {
                const roomId = `room_${floor}_${x}`;
                let roomType;

                if (isFirstFloor) {
                    roomType = RoomType.BATTLE;
                    startRoomId = roomId;
                } else if (isBossFloor) {
                    roomType = RoomType.BOSS;
                    bossRoomId = roomId;
                } else {
                    roomType = this.randomRoomType();
                }

                const room = {
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

    randomRoomType() {
        const weights = this.config.roomWeights;
        const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
        let random = this.rng() * totalWeight;

        for (const [type, weight] of Object.entries(weights)) {
            random -= weight;
            if (random <= 0) return type;
        }
        return RoomType.BATTLE;
    }

    connectRooms(rooms, floors) {
        for (let floor = 0; floor < floors - 1; floor++) {
            const currentFloorRooms = Array.from(rooms.values()).filter(r => r.y === floor);
            const nextFloorRooms = Array.from(rooms.values()).filter(r => r.y === floor + 1);

            for (const currentRoom of currentFloorRooms) {
                const connectionCount = Math.floor(this.rng() * (this.config.maxConnections - this.config.minConnections + 1)) + this.config.minConnections;
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

    generateRoomData(type, floor, chapter) {
        switch (type) {
            case RoomType.BATTLE:
            case RoomType.ELITE:
                return { enemyIds: this.generateEnemies(type, floor, chapter) };
            case RoomType.EVENT:
                return { eventId: `event_${chapter}_${floor}_${Math.floor(this.rng() * 10)}` };
            case RoomType.TREASURE:
                return { treasureId: `treasure_${chapter}_${floor}_${Math.floor(this.rng() * 5)}` };
            case RoomType.SHOP:
                return { shopItems: this.generateShopItems(floor, chapter) };
            default:
                return {};
        }
    }

    generateEnemies(type, floor, chapter) {
        const count = type === RoomType.ELITE ? 1 : Math.floor(this.rng() * 2) + 1;
        const enemies = [];
        for (let i = 0; i < count; i++) {
            const enemyTier = Math.min(chapter, 4);
            const enemyId = `enemy_ch${chapter}_t${enemyTier}_${Math.floor(this.rng() * 5)}`;
            enemies.push(enemyId);
        }
        return enemies;
    }

    generateShopItems(floor, chapter) {
        const items = [];
        const itemCount = 3 + Math.floor(this.rng() * 3);
        for (let i = 0; i < itemCount; i++) {
            const rand = this.rng();
            const type = rand < 0.6 ? 'card' : (rand < 0.8 ? 'consumable' : 'relic');
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
}

class TowerMapManager {
    constructor() {
        this.currentMap = null;
        this.visitedRooms = new Set();
        this.pathHistory = [];
    }

    createNewMap(chapter, seed) {
        const generator = new TowerMapGenerator(undefined, seed);
        const chapterNames = ['记忆迷宫', '遗忘之境', '深海回忆', '愤怒火山'];
        
        this.currentMap = generator.generateMap(
            `map_ch${chapter}_${Date.now()}`,
            chapterNames[chapter - 1] || '未知领域',
            12 + chapter * 2,
            chapter
        );
        
        this.visitedRooms.clear();
        this.pathHistory = [this.currentMap.startRoomId];
        
        return this.currentMap;
    }

    getCurrentRoom() {
        if (!this.currentMap || this.pathHistory.length === 0) return null;
        const currentId = this.pathHistory[this.pathHistory.length - 1];
        return this.currentMap.rooms.get(currentId) || null;
    }

    moveToRoom(roomId) {
        if (!this.currentMap) return false;
        const currentRoom = this.getCurrentRoom();
        if (!currentRoom || !currentRoom.connections.includes(roomId)) return false;

        const targetRoom = this.currentMap.rooms.get(roomId);
        if (!targetRoom) return false;

        this.pathHistory.push(roomId);
        this.visitedRooms.add(roomId);
        targetRoom.visited = true;
        this.currentMap.currentFloor = targetRoom.y;

        return true;
    }

    getAvailableMoves() {
        const currentRoom = this.getCurrentRoom();
        if (!currentRoom || !this.currentMap) return [];
        return currentRoom.connections.map(id => this.currentMap.rooms.get(id)).filter(room => room !== undefined);
    }

    clearCurrentRoom() {
        const currentRoom = this.getCurrentRoom();
        if (currentRoom) currentRoom.cleared = true;
    }

    isAtBossRoom() {
        if (!this.currentMap) return false;
        const currentRoom = this.getCurrentRoom();
        return currentRoom?.id === this.currentMap.bossRoomId;
    }

    getProgress() {
        if (!this.currentMap) return 0;
        return (this.currentMap.currentFloor / (this.currentMap.floors - 1)) * 100;
    }

    getCurrentMap() {
        return this.currentMap;
    }

    getPathHistory() {
        return [...this.pathHistory];
    }
}

// 导出到全局
window.RoomType = RoomType;
window.TowerMapGenerator = TowerMapGenerator;
window.TowerMapManager = TowerMapManager;
window.towerMapManager = new TowerMapManager();
