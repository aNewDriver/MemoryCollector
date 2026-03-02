/**
 * 后端API服务器
 * Node.js + Express + TypeScript
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { testConnection, initDatabase } from './db';
import { register, login, guestLogin, authMiddleware } from './routes/auth';
import { getSave, saveGame, deleteSave, listSaves } from './routes/save';
import { getLeaderboard, updateScore, getLeaderboardTypes } from './routes/leaderboard';
import { getMails, getMailDetail, markAsRead, claimAttachments, sendMail, deleteMail } from './routes/mail';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(helmet());
app.use(cors());
app.use(express.json());

// 限流
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100 // 每IP 100请求
});
app.use('/api/', limiter);

// 健康检查
app.get('/health', async (req, res) => {
    const dbConnected = await testConnection();
    res.json({ 
        status: dbConnected ? 'ok' : 'degraded', 
        timestamp: new Date().toISOString(),
        database: dbConnected ? 'connected' : 'disconnected'
    });
});

// ===== 认证模块 =====
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.post('/api/auth/guest', guestLogin);

// ===== 存档模块 (需要认证) =====
app.get('/api/save/:userId', authMiddleware, getSave);
app.post('/api/save/:userId', authMiddleware, saveGame);
app.delete('/api/save/:userId', authMiddleware, deleteSave);
app.get('/api/saves', authMiddleware, listSaves);

// ===== 排行榜模块 =====
app.get('/api/leaderboard/types', getLeaderboardTypes);
app.get('/api/leaderboard/:type', getLeaderboard);
app.post('/api/leaderboard/:type/score', authMiddleware, updateScore);

// ===== 邮件模块 (需要认证) =====
app.get('/api/mail/:userId', authMiddleware, getMails);
app.get('/api/mail/:userId/:mailId', authMiddleware, getMailDetail);
app.post('/api/mail/:userId/read', authMiddleware, markAsRead);
app.post('/api/mail/:userId/claim', authMiddleware, claimAttachments);
app.post('/api/mail/:userId/delete', authMiddleware, deleteMail);

// 系统邮件接口（管理员用）
app.post('/api/admin/mail/send', sendMail);

// ===== 公会模块 (简化版) =====
app.get('/api/guild/:guildId', async (req, res) => {
    const { guildId } = req.params;
    res.json({
        success: true,
        guild: {
            id: guildId,
            name: '测试公会',
            level: 1,
            exp: 0,
            members: [],
            maxMembers: 30
        }
    });
});

// ===== 聊天模块 (简化版) =====
app.get('/api/chat/history/:channel', async (req, res) => {
    const { channel } = req.params;
    res.json({ 
        success: true, 
        channel,
        messages: []
    });
});

// ===== 支付模块 (简化版) =====
app.post('/api/payment/create', async (req, res) => {
    const { productId, userId } = req.body;
    res.json({
        success: true,
        orderId: `ORDER_${Date.now()}`,
        productId,
        amount: 648,
        currency: 'CNY',
        status: 'pending'
    });
});

app.post('/api/payment/verify', async (req, res) => {
    const { orderId, receipt } = req.body;
    res.json({ 
        success: true, 
        orderId,
        status: 'completed'
    });
});

// ===== 游戏配置接口 =====
app.get('/api/config', async (req, res) => {
    res.json({
        success: true,
        config: {
            version: '1.0.0',
            maintenance: false,
            features: {
                pvp: true,
                guild: true,
                chat: true,
                payment: true
            }
        }
    });
});

// 错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

// 启动服务器
async function startServer() {
    // 初始化数据库
    try {
        await initDatabase();
        console.log('✅ Database initialized');
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
    }
    
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
}

startServer();
