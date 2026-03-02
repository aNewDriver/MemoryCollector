/**
 * 邮件系统模块
 */

import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../db';

// 获取邮件列表
export async function getMails(req: Request, res: Response) {
    try {
        const { userId } = req.params;
        
        const [rows] = await pool.execute(
            `SELECT id, title, is_read, is_claimed, created_at, expire_at 
             FROM mails 
             WHERE user_id = ? AND (expire_at IS NULL OR expire_at > NOW())
             ORDER BY created_at DESC`,
            [userId]
        );
        
        const mails = (rows as any[]).map(row => ({
            id: row.id,
            title: row.title,
            isRead: row.is_read === 1,
            isClaimed: row.is_claimed === 1,
            createdAt: new Date(row.created_at).getTime(),
            expireAt: row.expire_at ? new Date(row.expire_at).getTime() : null
        }));
        
        // 统计未读和未领取
        const unreadCount = mails.filter(m => !m.isRead).length;
        const unclaimedCount = mails.filter(m => !m.isClaimed).length;
        
        res.json({
            success: true,
            mails,
            unreadCount,
            unclaimedCount
        });
    } catch (error) {
        console.error('Get mails error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

// 获取邮件详情
export async function getMailDetail(req: Request, res: Response) {
    try {
        const { userId, mailId } = req.params;
        
        const [rows] = await pool.execute(
            'SELECT * FROM mails WHERE id = ? AND user_id = ?',
            [mailId, userId]
        );
        
        const mails = rows as any[];
        if (mails.length === 0) {
            return res.status(404).json({ success: false, error: 'Mail not found' });
        }
        
        const mail = mails[0];
        res.json({
            success: true,
            mail: {
                id: mail.id,
                title: mail.title,
                content: mail.content,
                attachments: JSON.parse(mail.attachments || '[]'),
                isRead: mail.is_read === 1,
                isClaimed: mail.is_claimed === 1,
                createdAt: new Date(mail.created_at).getTime(),
                expireAt: mail.expire_at ? new Date(mail.expire_at).getTime() : null
            }
        });
    } catch (error) {
        console.error('Get mail detail error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

// 标记已读
export async function markAsRead(req: Request, res: Response) {
    try {
        const { userId } = req.params;
        const { mailId } = req.body;
        
        await pool.execute(
            'UPDATE mails SET is_read = TRUE WHERE id = ? AND user_id = ?',
            [mailId, userId]
        );
        
        res.json({ success: true });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

// 领取附件
export async function claimAttachments(req: Request, res: Response) {
    try {
        const { userId } = req.params;
        const { mailId } = req.body;
        
        const [rows] = await pool.execute(
            'SELECT attachments, is_claimed FROM mails WHERE id = ? AND user_id = ?',
            [mailId, userId]
        );
        
        const mails = rows as any[];
        if (mails.length === 0) {
            return res.status(404).json({ success: false, error: 'Mail not found' });
        }
        
        if (mails[0].is_claimed) {
            return res.status(400).json({ success: false, error: 'Already claimed' });
        }
        
        // 标记已领取
        await pool.execute(
            'UPDATE mails SET is_claimed = TRUE WHERE id = ?',
            [mailId]
        );
        
        const attachments = JSON.parse(mails[0].attachments || '[]');
        
        res.json({
            success: true,
            rewards: attachments
        });
    } catch (error) {
        console.error('Claim attachments error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

// 发送邮件（系统邮件）
export async function sendMail(req: Request, res: Response) {
    try {
        const { userId, title, content, attachments, expireDays } = req.body;
        
        const mailId = uuidv4();
        const expireAt = expireDays ? new Date(Date.now() + expireDays * 24 * 60 * 60 * 1000) : null;
        
        await pool.execute(
            `INSERT INTO mails (id, user_id, title, content, attachments, expire_at) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [mailId, userId, title, content, JSON.stringify(attachments || []), expireAt]
        );
        
        res.json({ success: true, mailId });
    } catch (error) {
        console.error('Send mail error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

// 删除邮件
export async function deleteMail(req: Request, res: Response) {
    try {
        const { userId } = req.params;
        const { mailId } = req.body;
        
        await pool.execute(
            'DELETE FROM mails WHERE id = ? AND user_id = ?',
            [mailId, userId]
        );
        
        res.json({ success: true });
    } catch (error) {
        console.error('Delete mail error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
