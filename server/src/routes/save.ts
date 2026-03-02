/**
 * 存档管理模块
 */

import { Request, Response } from 'express';
import pool from '../db';

// 获取存档
export async function getSave(req: Request, res: Response) {
    try {
        const { userId } = req.params;
        
        const [rows] = await pool.execute(
            'SELECT version, data, timestamp FROM saves WHERE user_id = ?',
            [userId]
        );
        
        const saves = rows as any[];
        if (saves.length === 0) {
            // 返回空存档
            return res.json({
                success: true,
                exists: false,
                version: 0,
                timestamp: Date.now(),
                data: {}
            });
        }
        
        const save = saves[0];
        res.json({
            success: true,
            exists: true,
            version: save.version,
            timestamp: save.timestamp,
            data: JSON.parse(save.data)
        });
    } catch (error) {
        console.error('Get save error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

// 保存存档
export async function saveGame(req: Request, res: Response) {
    try {
        const { userId } = req.params;
        const { data, version } = req.body;
        
        if (!data) {
            return res.status(400).json({ success: false, error: 'Save data required' });
        }
        
        // 检查存档是否存在
        const [existing] = await pool.execute(
            'SELECT version FROM saves WHERE user_id = ?',
            [userId]
        );
        
        const newVersion = (version || 0) + 1;
        const timestamp = Date.now();
        
        if ((existing as any[]).length === 0) {
            // 创建新存档
            await pool.execute(
                'INSERT INTO saves (user_id, version, data, timestamp) VALUES (?, ?, ?, ?)',
                [userId, newVersion, JSON.stringify(data), timestamp]
            );
        } else {
            // 更新存档
            await pool.execute(
                'UPDATE saves SET version = ?, data = ?, timestamp = ? WHERE user_id = ?',
                [newVersion, JSON.stringify(data), timestamp, userId]
            );
        }
        
        res.json({
            success: true,
            version: newVersion,
            timestamp
        });
    } catch (error) {
        console.error('Save game error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

// 删除存档
export async function deleteSave(req: Request, res: Response) {
    try {
        const { userId } = req.params;
        
        await pool.execute('DELETE FROM saves WHERE user_id = ?', [userId]);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Delete save error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

// 获取存档列表（管理用）
export async function listSaves(req: Request, res: Response) {
    try {
        const [rows] = await pool.execute(
            'SELECT user_id, version, timestamp, updated_at FROM saves ORDER BY updated_at DESC LIMIT 100'
        );
        
        res.json({
            success: true,
            saves: rows
        });
    } catch (error) {
        console.error('List saves error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
