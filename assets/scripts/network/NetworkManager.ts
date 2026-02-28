/**
 * 网络同步系统
 * 多人对战、实时PVP、数据同步
 */

export enum NetworkState {
    DISCONNECTED = 'disconnected',
    CONNECTING = 'connecting',
    CONNECTED = 'connected',
    RECONNECTING = 'reconnecting'
}

export interface PlayerSyncData {
    playerId: string;
    timestamp: number;
    position?: { x: number; y: number };
    state?: string;
    hp?: number;
    mp?: number;
}

export interface BattleAction {
    actionId: string;
    playerId: string;
    type: 'skill' | 'item' | 'surrender';
    targetId?: string;
    skillId?: string;
    itemId?: string;
    timestamp: number;
}

export class NetworkManager {
    private state: NetworkState = NetworkState.DISCONNECTED;
    private serverUrl: string = '';
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private reconnectDelay: number = 3000;
    
    // 回调函数
    private onConnectCallback?: () => void;
    private onDisconnectCallback?: () => void;
    private onMessageCallback?: (data: any) => void;
    private onErrorCallback?: (error: any) => void;
    
    // 战斗相关
    private battleRoomId: string = '';
    private pendingActions: BattleAction[] = [];
    
    // 连接服务器
    public connect(url: string): Promise<boolean> {
        this.serverUrl = url;
        this.state = NetworkState.CONNECTING;
        
        return new Promise((resolve) => {
            // TODO: 实际WebSocket连接
            // 模拟连接成功
            setTimeout(() => {
                this.state = NetworkState.CONNECTED;
                this.reconnectAttempts = 0;
                this.onConnectCallback?.();
                resolve(true);
            }, 1000);
        });
    }
    
    // 断开连接
    public disconnect(): void {
        this.state = NetworkState.DISCONNECTED;
        this.onDisconnectCallback?.();
    }
    
    // 发送消息
    public send(message: any): boolean {
        if (this.state !== NetworkState.CONNECTED) {
            console.error('[Network] Not connected');
            return false;
        }
        
        // TODO: 实际发送
        console.log('[Network] Send:', message);
        return true;
    }
    
    // 发送战斗动作
    public sendBattleAction(action: Omit<BattleAction, 'timestamp'>): boolean {
        const fullAction: BattleAction = {
            ...action,
            timestamp: Date.now()
        };
        
        if (this.state !== NetworkState.CONNECTED) {
            // 缓存待网络恢复后发送
            this.pendingActions.push(fullAction);
            return false;
        }
        
        return this.send({
            type: 'battle_action',
            roomId: this.battleRoomId,
            action: fullAction
        });
    }
    
    // 加入战斗房间
    public joinBattleRoom(roomId: string, playerId: string): Promise<boolean> {
        this.battleRoomId = roomId;
        
        return new Promise((resolve) => {
            this.send({
                type: 'join_room',
                roomId,
                playerId
            });
            
            // TODO: 等待服务器确认
            setTimeout(() => resolve(true), 500);
        });
    }
    
    // 离开战斗房间
    public leaveBattleRoom(): void {
        this.send({
            type: 'leave_room',
            roomId: this.battleRoomId
        });
        this.battleRoomId = '';
    }
    
    // 同步玩家数据
    public syncPlayerData(data: PlayerSyncData): void {
        this.send({
            type: 'sync_data',
            data: {
                ...data,
                timestamp: Date.now()
            }
        });
    }
    
    // 重连逻辑
    private async reconnect(): Promise<void> {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('[Network] Max reconnection attempts reached');
            this.state = NetworkState.DISCONNECTED;
            return;
        }
        
        this.state = NetworkState.RECONNECTING;
        this.reconnectAttempts++;
        
        console.log(`[Network] Reconnecting... Attempt ${this.reconnectAttempts}`);
        
        await new Promise(resolve => setTimeout(resolve, this.reconnectDelay));
        
        const success = await this.connect(this.serverUrl);
        if (success) {
            // 重新加入房间
            if (this.battleRoomId) {
                // TODO: 重新加入逻辑
            }
            // 发送缓存的动作
            while (this.pendingActions.length > 0) {
                const action = this.pendingActions.shift();
                this.sendBattleAction(action!);
            }
        }
    }
    
    // 设置回调
    public onConnect(callback: () => void): void {
        this.onConnectCallback = callback;
    }
    
    public onDisconnect(callback: () => void): void {
        this.onDisconnectCallback = callback;
    }
    
    public onMessage(callback: (data: any) => void): void {
        this.onMessageCallback = callback;
    }
    
    public onError(callback: (error: any) => void): void {
        this.onErrorCallback = callback;
    }
    
    // 获取连接状态
    public getState(): NetworkState {
        return this.state;
    }
    
    public isConnected(): boolean {
        return this.state === NetworkState.CONNECTED;
    }
    
    // 心跳检测
    public startHeartbeat(interval: number = 30000): void {
        setInterval(() => {
            if (this.isConnected()) {
                this.send({ type: 'ping', timestamp: Date.now() });
            }
        }, interval);
    }
}

// 单例
export const networkManager = new NetworkManager();
