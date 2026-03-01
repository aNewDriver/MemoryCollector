/**
 * 反作弊执行器
 * 封禁/解封/警告等处罚执行
 */

import { logSystem } from '../log/LogSystem';
import { notificationSystem } from '../notification/NotificationSystem';

export enum PunishmentType {
    WARNING = 'warning',           // 警告
    MUTE = 'mute',                 // 禁言
    SUSPEND = 'suspend',           // 临时封号
    BAN = 'ban',                   // 永久封号
    DEVICE_BAN = 'device_ban',     // 设备封禁
    IP_BAN = 'ip_ban'              // IP封禁
}

export interface PunishmentRecord {
    id: string;
    playerId: string;
    type: PunishmentType;
    reason: string;
    evidence: string;
    startTime: number;
    endTime?: number;             // 永久封禁则无
    isActive: boolean;
    appliedBy: string;            // 处理人（SYSTEM或GM）
    appealed: boolean;
    appealResult?: 'upheld' | 'overturned';
}

export interface PlayerBanStatus {
    isBanned: boolean;
    banType?: PunishmentType;
    banReason?: string;
    banEndTime?: number;
    remainingTime?: number;
}

export class AntiCheatEnforcer {
    private punishments: Map<string, PunishmentRecord[]> = new Map();  // playerId -> records
    private activeBans: Map<string, PunishmentRecord> = new Map();      // playerId -> active ban
    private deviceBans: Set<string> = new Set();
    private ipBans: Set<string> = new Set();
    private mutedPlayers: Map<string, number> = new Map();  // playerId -> muteEndTime
    
    /**
     * 执行警告
     */
    public warn(
        playerId: string,
        reason: string,
        evidence: string
    ): { success: boolean; record?: PunishmentRecord } {
        const record = this.createPunishment(
            playerId,
            PunishmentType.WARNING,
            reason,
            evidence,
            'SYSTEM'
        );
        
        // 发送警告通知
        this.notifyPlayer(playerId, 'warning', reason);
        
        logSystem.warn('AntiCheat', `Player warned: ${playerId}`, { reason, evidence });
        
        return { success: true, record };
    }
    
    /**
     * 执行禁言
     */
    public mute(
        playerId: string,
        durationHours: number,
        reason: string,
        evidence: string
    ): { success: boolean; record?: PunishmentRecord } {
        const endTime = Date.now() + durationHours * 60 * 60 * 1000;
        
        const record = this.createPunishment(
            playerId,
            PunishmentType.MUTE,
            reason,
            evidence,
            'SYSTEM',
            endTime
        );
        
        this.mutedPlayers.set(playerId, endTime);
        
        // 发送禁言通知
        this.notifyPlayer(playerId, 'mute', `${reason}（禁言${durationHours}小时）`);
        
        logSystem.warn('AntiCheat', `Player muted: ${playerId} for ${durationHours}h`, { reason });
        
        return { success: true, record };
    }
    
    /**
     * 执行临时封号
     */
    public suspend(
        playerId: string,
        durationDays: number,
        reason: string,
        evidence: string
    ): { success: boolean; record?: PunishmentRecord } {
        // 先解除已有封禁
        this.unban(playerId);
        
        const endTime = Date.now() + durationDays * 24 * 60 * 60 * 1000;
        
        const record = this.createPunishment(
            playerId,
            PunishmentType.SUSPEND,
            reason,
            evidence,
            'SYSTEM',
            endTime
        );
        
        this.activeBans.set(playerId, record);
        
        // 踢下线（如果在线）
        this.kickPlayer(playerId, `账号被封禁${durationDays}天：${reason}`);
        
        // 发送封号通知
        this.notifyPlayer(playerId, 'suspend', `${reason}（封禁${durationDays}天）`);
        
        logSystem.error('AntiCheat', `Player suspended: ${playerId} for ${durationDays}d`, { reason });
        
        return { success: true, record };
    }
    
    /**
     * 执行永久封号
     */
    public ban(
        playerId: string,
        reason: string,
        evidence: string,
        banDevice: boolean = false,
        banIP: boolean = false
    ): { success: boolean; record?: PunishmentRecord } {
        // 先解除已有封禁
        this.unban(playerId);
        
        const record = this.createPunishment(
            playerId,
            PunishmentType.BAN,
            reason,
            evidence,
            'SYSTEM'
        );
        
        this.activeBans.set(playerId, record);
        
        // 获取设备信息和IP进行封禁
        if (banDevice) {
            const deviceId = this.getPlayerDeviceId(playerId);
            if (deviceId) {
                this.deviceBans.add(deviceId);
                record.type = PunishmentType.DEVICE_BAN;
            }
        }
        
        if (banIP) {
            const ip = this.getPlayerIP(playerId);
            if (ip) {
                this.ipBans.add(ip);
                record.type = PunishmentType.IP_BAN;
            }
        }
        
        // 踢下线
        this.kickPlayer(playerId, `账号被永久封禁：${reason}`);
        
        // 发送封号通知
        this.notifyPlayer(playerId, 'ban', `${reason}（永久封禁）`);
        
        logSystem.error('AntiCheat', `Player banned: ${playerId}`, { reason, banDevice, banIP });
        
        return { success: true, record };
    }
    
    /**
     * 解封账号
     */
    public unban(playerId: string): boolean {
        const ban = this.activeBans.get(playerId);
        if (!ban) return false;
        
        ban.isActive = false;
        ban.endTime = Date.now();
        
        this.activeBans.delete(playerId);
        
        // 解除设备封禁
        if (ban.type === PunishmentType.DEVICE_BAN) {
            const deviceId = this.getPlayerDeviceId(playerId);
            if (deviceId) {
                this.deviceBans.delete(deviceId);
            }
        }
        
        // 解除IP封禁
        if (ban.type === PunishmentType.IP_BAN) {
            const ip = this.getPlayerIP(playerId);
            if (ip) {
                this.ipBans.delete(ip);
            }
        }
        
        // 发送解封通知
        this.notifyPlayer(playerId, 'unban', '您的账号已解封，请遵守游戏规则');
        
        logSystem.info('AntiCheat', `Player unbanned: ${playerId}`);
        
        return true;
    }
    
    /**
     * 检查玩家封禁状态
     */
    public checkBanStatus(
        playerId: string,
        deviceId?: string,
        ip?: string
    ): PlayerBanStatus {
        // 检查账号封禁
        const ban = this.activeBans.get(playerId);
        if (ban) {
            // 检查是否过期
            if (ban.endTime && Date.now() > ban.endTime) {
                this.unban(playerId);
                return { isBanned: false };
            }
            
            return {
                isBanned: true,
                banType: ban.type,
                banReason: ban.reason,
                banEndTime: ban.endTime,
                remainingTime: ban.endTime ? ban.endTime - Date.now() : undefined
            };
        }
        
        // 检查设备封禁
        if (deviceId && this.deviceBans.has(deviceId)) {
            return {
                isBanned: true,
                banType: PunishmentType.DEVICE_BAN,
                banReason: '该设备已被封禁'
            };
        }
        
        // 检查IP封禁
        if (ip && this.ipBans.has(ip)) {
            return {
                isBanned: true,
                banType: PunishmentType.IP_BAN,
                banReason: '该IP已被封禁'
            };
        }
        
        return { isBanned: false };
    }
    
    /**
     * 检查是否被禁言
     */
    public isMuted(playerId: string): boolean {
        const muteEndTime = this.mutedPlayers.get(playerId);
        if (!muteEndTime) return false;
        
        if (Date.now() > muteEndTime) {
            this.mutedPlayers.delete(playerId);
            return false;
        }
        
        return true;
    }
    
    /**
     * 获取剩余禁言时间
     */
    public getMuteRemainingTime(playerId: string): number {
        const muteEndTime = this.mutedPlayers.get(playerId);
        if (!muteEndTime) return 0;
        
        return Math.max(0, muteEndTime - Date.now());
    }
    
    /**
     * 获取玩家处罚记录
     */
    public getPunishmentHistory(playerId: string): PunishmentRecord[] {
        return this.punishments.get(playerId) || [];
    }
    
    /**
     * 提交申诉
     */
    public submitAppeal(
        playerId: string,
        punishmentId: string,
        reason: string
    ): boolean {
        const punishments = this.punishments.get(playerId);
        if (!punishments) return false;
        
        const punishment = punishments.find(p => p.id === punishmentId);
        if (!punishment || !punishment.isActive) return false;
        
        punishment.appealed = true;
        
        logSystem.info('AntiCheat', `Appeal submitted: ${playerId}`, { punishmentId, reason });
        
        return true;
    }
    
    /**
     * 处理申诉
     */
    public handleAppeal(
        playerId: string,
        punishmentId: string,
        result: 'upheld' | 'overturned',
        handledBy: string
    ): boolean {
        const punishments = this.punishments.get(playerId);
        if (!punishments) return false;
        
        const punishment = punishments.find(p => p.id === punishmentId);
        if (!punishment) return false;
        
        punishment.appealResult = result;
        
        if (result === 'overturned') {
            this.unban(playerId);
            this.notifyPlayer(playerId, 'appeal_success', '您的申诉已通过，账号已解封');
        } else {
            this.notifyPlayer(playerId, 'appeal_rejected', '您的申诉未通过');
        }
        
        logSystem.info('AntiCheat', `Appeal handled: ${playerId}`, { punishmentId, result, handledBy });
        
        return true;
    }
    
    /**
     * 创建处罚记录
     */
    private createPunishment(
        playerId: string,
        type: PunishmentType,
        reason: string,
        evidence: string,
        appliedBy: string,
        endTime?: number
    ): PunishmentRecord {
        const record: PunishmentRecord = {
            id: `PUN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            playerId,
            type,
            reason,
            evidence,
            startTime: Date.now(),
            endTime,
            isActive: true,
            appliedBy,
            appealed: false
        };
        
        if (!this.punishments.has(playerId)) {
            this.punishments.set(playerId, []);
        }
        this.punishments.get(playerId)!.push(record);
        
        return record;
    }
    
    /**
     * 通知玩家
     */
    private notifyPlayer(playerId: string, type: string, message: string): void {
        // TODO: 实际通知实现
        console.log(`[AntiCheat] Notify ${playerId}: [${type}] ${message}`);
    }
    
    /**
     * 踢玩家下线
     */
    private kickPlayer(playerId: string, reason: string): void {
        // TODO: 实际踢下线实现
        console.log(`[AntiCheat] Kick player ${playerId}: ${reason}`);
    }
    
    /**
     * 获取玩家设备ID
     */
    private getPlayerDeviceId(playerId: string): string | null {
        // TODO: 从玩家数据获取
        return null;
    }
    
    /**
     * 获取玩家IP
     */
    private getPlayerIP(playerId: string): string | null {
        // TODO: 从玩家数据获取
        return null;
    }
    
    /**
     * 获取所有活跃封禁
     */
    public getActiveBans(): PunishmentRecord[] {
        return Array.from(this.activeBans.values());
    }
    
    /**
     * 定期清理过期处罚
     */
    public cleanupExpired(): void {
        const now = Date.now();
        
        // 清理过期禁言
        this.mutedPlayers.forEach((endTime, playerId) => {
            if (now > endTime) {
                this.mutedPlayers.delete(playerId);
            }
        });
        
        // 清理过期临时封号
        this.activeBans.forEach((ban, playerId) => {
            if (ban.endTime && now > ban.endTime) {
                this.unban(playerId);
            }
        });
    }
}

// 单例
export const antiCheatEnforcer = new AntiCheatEnforcer();
