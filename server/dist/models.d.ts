/**
 * 数据库模型定义
 */
export interface User {
    id: string;
    username: string;
    password: string;
    email?: string;
    phone?: string;
    avatar?: string;
    level: number;
    vipLevel: number;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date;
}
export interface SaveData {
    id: string;
    userId: string;
    version: number;
    data: string;
    checksum: string;
    deviceId?: string;
    createdAt: Date;
}
export interface LeaderboardEntry {
    id: string;
    type: string;
    userId: string;
    username: string;
    score: number;
    rank: number;
    season: string;
    updatedAt: Date;
}
export interface Guild {
    id: string;
    name: string;
    description: string;
    level: number;
    exp: number;
    maxMembers: number;
    presidentId: string;
    createdAt: Date;
}
export interface GuildMember {
    id: string;
    guildId: string;
    userId: string;
    role: 'president' | 'vice' | 'elder' | 'member';
    contribution: number;
    joinedAt: Date;
}
export interface Mail {
    id: string;
    userId: string;
    type: 'reward' | 'system' | 'event' | 'guild' | 'battle';
    sender: string;
    title: string;
    content: string;
    attachments: string;
    isRead: boolean;
    isClaimed: boolean;
    isImportant: boolean;
    sendTime: Date;
    expireTime: Date;
}
export interface ChatMessage {
    id: string;
    channel: 'world' | 'guild' | 'private';
    fromUserId: string;
    fromUsername: string;
    toUserId?: string;
    content: string;
    timestamp: Date;
}
export interface PaymentOrder {
    id: string;
    userId: string;
    productId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    platform: 'wechat' | 'alipay' | 'apple';
    platformOrderId?: string;
    createdAt: Date;
    paidAt?: Date;
}
//# sourceMappingURL=models.d.ts.map