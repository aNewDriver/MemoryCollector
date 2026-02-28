/**
 * 聊天系统
 * 玩家交流、好友私聊、世界频道
 */

export enum ChatChannel {
    WORLD = 'world',       // 世界频道
    GUILD = 'guild',       // 公会频道
    PRIVATE = 'private',   // 私聊
    SYSTEM = 'system',     // 系统公告
    TEAM = 'team'          // 队伍频道
}

export interface ChatMessage {
    id: string;
    channel: ChatChannel;
    sender: {
        playerId: string;
        name: string;
        avatar?: string;
        level: number;
        title?: string;
    };
    content: string;
    timestamp: number;
    isRead?: boolean;
}

export interface ChatRoom {
    channel: ChatChannel;
    name: string;
    messages: ChatMessage[];
    unreadCount: number;
    lastMessage?: ChatMessage;
}

export interface Friend {
    playerId: string;
    name: string;
    level: number;
    isOnline: boolean;
    lastLoginTime: number;
    canSendStamina: boolean;  // 是否可以赠送体力
    hasSentStaminaToday: boolean;
    intimacy: number;  // 亲密度
    chatHistory: ChatMessage[];
}

export class ChatSystem {
    private chatRooms: Map<ChatChannel, ChatRoom> = new Map();
    private friends: Map<string, Friend> = new Map();
    private blockedPlayers: Set<string> = new Set();
    private maxMessagesPerChannel: number = 100;
    
    constructor() {
        this.initializeChatRooms();
    }
    
    private initializeChatRooms() {
        Object.values(ChatChannel).forEach(channel => {
            this.chatRooms.set(channel, {
                channel,
                name: this.getChannelName(channel),
                messages: [],
                unreadCount: 0
            });
        });
    }
    
    private getChannelName(channel: ChatChannel): string {
        const names: Record<ChatChannel, string> = {
            [ChatChannel.WORLD]: '世界',
            [ChatChannel.GUILD]: '公会',
            [ChatChannel.PRIVATE]: '私聊',
            [ChatChannel.SYSTEM]: '系统',
            [ChatChannel.TEAM]: '队伍'
        };
        return names[channel];
    }
    
    // 发送消息
    public sendMessage(
        channel: ChatChannel,
        senderId: string,
        senderName: string,
        content: string,
        senderLevel: number = 1
    ): { success: boolean; error?: string } {
        // 检查是否被禁言
        if (this.isMuted(senderId)) {
            return { success: false, error: '您已被禁言' };
        }
        
        // 检查内容长度
        if (content.length > 200) {
            return { success: false, error: '消息过长（最多200字）' };
        }
        
        // 检查屏蔽列表
        if (channel === ChatChannel.PRIVATE) {
            // 私聊特殊处理
        }
        
        const message: ChatMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            channel,
            sender: {
                playerId: senderId,
                name: senderName,
                level: senderLevel
            },
            content: this.filterContent(content),
            timestamp: Date.now()
        };
        
        const room = this.chatRooms.get(channel);
        if (room) {
            room.messages.push(message);
            room.lastMessage = message;
            
            // 限制消息数量
            if (room.messages.length > this.maxMessagesPerChannel) {
                room.messages.shift();
            }
            
            // 世界频道增加未读计数
            if (channel === ChatChannel.WORLD) {
                room.unreadCount++;
            }
        }
        
        return { success: true };
    }
    
    // 获取频道消息
    public getChannelMessages(
        channel: ChatChannel,
        limit: number = 50
    ): ChatMessage[] {
        const room = this.chatRooms.get(channel);
        if (!room) return [];
        
        // 标记已读
        if (channel === ChatChannel.WORLD) {
            room.unreadCount = 0;
        }
        
        return room.messages.slice(-limit);
    }
    
    // 获取所有频道未读数
    public getUnreadCounts(): Record<ChatChannel, number> {
        const counts: Partial<Record<ChatChannel, number>> = {};
        this.chatRooms.forEach((room, channel) => {
            counts[channel] = room.unreadCount;
        });
        return counts as Record<ChatChannel, number>;
    }
    
    // 添加好友
    public addFriend(playerId: string, name: string, level: number): {
        success: boolean;
        error?: string;
    } {
        if (this.friends.has(playerId)) {
            return { success: false, error: '已经是好友' };
        }
        
        if (this.friends.size >= 100) {
            return { success: false, error: '好友数量已达上限' };
        }
        
        this.friends.set(playerId, {
            playerId,
            name,
            level,
            isOnline: false,
            lastLoginTime: Date.now(),
            canSendStamina: true,
            hasSentStaminaToday: false,
            intimacy: 0,
            chatHistory: []
        });
        
        return { success: true };
    }
    
    // 删除好友
    public removeFriend(playerId: string): boolean {
        return this.friends.delete(playerId);
    }
    
    // 获取好友列表
    public getFriends(): Friend[] {
        return Array.from(this.friends.values()).sort((a, b) => {
            // 在线优先，然后按亲密度排序
            if (a.isOnline !== b.isOnline) {
                return a.isOnline ? -1 : 1;
            }
            return b.intimacy - a.intimacy;
        });
    }
    
    // 获取在线好友
    public getOnlineFriends(): Friend[] {
        return this.getFriends().filter(f => f.isOnline);
    }
    
    // 发送私聊消息
    public sendPrivateMessage(
        fromId: string,
        toId: string,
        content: string
    ): { success: boolean; error?: string } {
        if (this.blockedPlayers.has(toId)) {
            return { success: false, error: '对方已将您屏蔽' };
        }
        
        const friend = this.friends.get(toId);
        if (!friend) {
            return { success: false, error: '不是好友，无法私聊' };
        }
        
        const message: ChatMessage = {
            id: `private_${Date.now()}`,
            channel: ChatChannel.PRIVATE,
            sender: {
                playerId: fromId,
                name: 'Me',
                level: 1
            },
            content: this.filterContent(content),
            timestamp: Date.now()
        };
        
        friend.chatHistory.push(message);
        
        // 增加亲密度
        friend.intimacy = Math.min(friend.intimacy + 1, 9999);
        
        return { success: true };
    }
    
    // 获取与好友的聊天记录
    public getPrivateChatHistory(
        friendId: string,
        limit: number = 50
    ): ChatMessage[] {
        const friend = this.friends.get(friendId);
        if (!friend) return [];
        
        return friend.chatHistory.slice(-limit);
    }
    
    // 赠送体力
    public sendStamina(toId: string): {
        success: boolean;
        error?: string;
    } {
        const friend = this.friends.get(toId);
        if (!friend) {
            return { success: false, error: '不是好友' };
        }
        
        if (!friend.canSendStamina) {
            return { success: false, error: '今日已赠送' };
        }
        
        friend.canSendStamina = false;
        friend.intimacy += 5;
        
        return { success: true };
    }
    
    // 屏蔽玩家
    public blockPlayer(playerId: string): void {
        this.blockedPlayers.add(playerId);
    }
    
    // 解除屏蔽
    public unblockPlayer(playerId: string): void {
        this.blockedPlayers.delete(playerId);
    }
    
    // 是否屏蔽
    public isBlocked(playerId: string): boolean {
        return this.blockedPlayers.has(playerId);
    }
    
    // 内容过滤（简单版）
    private filterContent(content: string): string {
        // 敏感词列表
        const sensitiveWords = ['脏话', '广告', '违法'];
        let filtered = content;
        sensitiveWords.forEach(word => {
            filtered = filtered.replace(new RegExp(word, 'g'), '**');
        });
        return filtered;
    }
    
    // 检查是否被禁言
    private isMuted(playerId: string): boolean {
        // TODO: 实现禁言逻辑
        return false;
    }
    
    // 每日重置
    public dailyReset(): void {
        this.friends.forEach(friend => {
            friend.canSendStamina = true;
        });
    }
}

// 单例
export const chatSystem = new ChatSystem();
