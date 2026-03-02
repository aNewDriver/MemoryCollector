/**
 * 用户认证模块
 */

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import pool from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// 注册
export async function register(req: Request, res: Response) {
    try {
        const { username, password, email } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ success: false, error: 'Username and password required' });
        }
        
        // 检查用户名是否存在
        const [existing] = await pool.execute(
            'SELECT id FROM users WHERE username = ?',
            [username]
        );
        
        if ((existing as any[]).length > 0) {
            return res.status(409).json({ success: false, error: 'Username already exists' });
        }
        
        // 加密密码
        const passwordHash = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        
        // 创建用户
        await pool.execute(
            'INSERT INTO users (id, username, password_hash, email) VALUES (?, ?, ?, ?)',
            [userId, username, passwordHash, email || null]
        );
        
        // 生成JWT
        const token = jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
        
        res.json({
            success: true,
            userId,
            token,
            expiresIn: JWT_EXPIRES_IN
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

// 登录
export async function login(req: Request, res: Response) {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ success: false, error: 'Username and password required' });
        }
        
        // 查询用户
        const [rows] = await pool.execute(
            'SELECT id, username, password_hash FROM users WHERE username = ?',
            [username]
        );
        
        const users = rows as any[];
        if (users.length === 0) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        
        const user = users[0];
        
        // 验证密码
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        
        // 更新最后登录时间
        await pool.execute(
            'UPDATE users SET last_login = NOW() WHERE id = ?',
            [user.id]
        );
        
        // 生成JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN as any }
        );
        
        res.json({
            success: true,
            userId: user.id,
            token,
            expiresIn: JWT_EXPIRES_IN
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

// 游客登录
export async function guestLogin(req: Request, res: Response) {
    try {
        const userId = uuidv4();
        const username = `Guest_${Date.now().toString(36)}`;
        
        await pool.execute(
            'INSERT INTO users (id, username, password_hash, is_guest) VALUES (?, ?, ?, ?)',
            [userId, username, '', true]
        );
        
        const token = jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
        
        res.json({
            success: true,
            userId,
            username,
            token,
            isGuest: true
        });
    } catch (error) {
        console.error('Guest login error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

// 验证Token
export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
}

// 认证中间件
export function authMiddleware(req: Request, res: Response, next: any) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ success: false, error: 'No token provided' });
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
    }
    
    (req as any).user = decoded;
    next();
}
