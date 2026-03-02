"use strict";
/**
 * 邮件系统模块
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMails = getMails;
exports.getMailDetail = getMailDetail;
exports.markAsRead = markAsRead;
exports.claimAttachments = claimAttachments;
exports.sendMail = sendMail;
exports.deleteMail = deleteMail;
const uuid_1 = require("uuid");
const db_1 = __importDefault(require("../db"));
// 获取邮件列表
async function getMails(req, res) {
    try {
        const { userId } = req.params;
        const [rows] = await db_1.default.execute(`SELECT id, title, is_read, is_claimed, created_at, expire_at 
             FROM mails 
             WHERE user_id = ? AND (expire_at IS NULL OR expire_at > NOW())
             ORDER BY created_at DESC`, [userId]);
        const mails = rows.map(row => ({
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
    }
    catch (error) {
        console.error('Get mails error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
// 获取邮件详情
async function getMailDetail(req, res) {
    try {
        const { userId, mailId } = req.params;
        const [rows] = await db_1.default.execute('SELECT * FROM mails WHERE id = ? AND user_id = ?', [mailId, userId]);
        const mails = rows;
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
    }
    catch (error) {
        console.error('Get mail detail error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
// 标记已读
async function markAsRead(req, res) {
    try {
        const { userId } = req.params;
        const { mailId } = req.body;
        await db_1.default.execute('UPDATE mails SET is_read = TRUE WHERE id = ? AND user_id = ?', [mailId, userId]);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
// 领取附件
async function claimAttachments(req, res) {
    try {
        const { userId } = req.params;
        const { mailId } = req.body;
        const [rows] = await db_1.default.execute('SELECT attachments, is_claimed FROM mails WHERE id = ? AND user_id = ?', [mailId, userId]);
        const mails = rows;
        if (mails.length === 0) {
            return res.status(404).json({ success: false, error: 'Mail not found' });
        }
        if (mails[0].is_claimed) {
            return res.status(400).json({ success: false, error: 'Already claimed' });
        }
        // 标记已领取
        await db_1.default.execute('UPDATE mails SET is_claimed = TRUE WHERE id = ?', [mailId]);
        const attachments = JSON.parse(mails[0].attachments || '[]');
        res.json({
            success: true,
            rewards: attachments
        });
    }
    catch (error) {
        console.error('Claim attachments error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
// 发送邮件（系统邮件）
async function sendMail(req, res) {
    try {
        const { userId, title, content, attachments, expireDays } = req.body;
        const mailId = (0, uuid_1.v4)();
        const expireAt = expireDays ? new Date(Date.now() + expireDays * 24 * 60 * 60 * 1000) : null;
        await db_1.default.execute(`INSERT INTO mails (id, user_id, title, content, attachments, expire_at) 
             VALUES (?, ?, ?, ?, ?, ?)`, [mailId, userId, title, content, JSON.stringify(attachments || []), expireAt]);
        res.json({ success: true, mailId });
    }
    catch (error) {
        console.error('Send mail error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
// 删除邮件
async function deleteMail(req, res) {
    try {
        const { userId } = req.params;
        const { mailId } = req.body;
        await db_1.default.execute('DELETE FROM mails WHERE id = ? AND user_id = ?', [mailId, userId]);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Delete mail error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
//# sourceMappingURL=mail.js.map