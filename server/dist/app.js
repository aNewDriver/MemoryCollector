"use strict";
/**
 * 后端API服务器
 * Node.js + Express + TypeScript
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const auth_1 = require("./routes/auth");
const save_1 = require("./routes/save");
const leaderboard_1 = require("./routes/leaderboard");
const mail_1 = require("./routes/mail");
// 加载环境变量
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// 中间件
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 限流
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100 // 每IP 100请求
});
app.use('/api/', limiter);
// 健康检查
app.get('/health', async (req, res) => {
    const dbConnected = await (0, db_1.testConnection)();
    res.json({
        status: dbConnected ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        database: dbConnected ? 'connected' : 'disconnected'
    });
});
// ===== 认证模块 =====
app.post('/api/auth/register', auth_1.register);
app.post('/api/auth/login', auth_1.login);
app.post('/api/auth/guest', auth_1.guestLogin);
// ===== 存档模块 (需要认证) =====
app.get('/api/save/:userId', auth_1.authMiddleware, save_1.getSave);
app.post('/api/save/:userId', auth_1.authMiddleware, save_1.saveGame);
app.delete('/api/save/:userId', auth_1.authMiddleware, save_1.deleteSave);
app.get('/api/saves', auth_1.authMiddleware, save_1.listSaves);
// ===== 排行榜模块 =====
app.get('/api/leaderboard/types', leaderboard_1.getLeaderboardTypes);
app.get('/api/leaderboard/:type', leaderboard_1.getLeaderboard);
app.post('/api/leaderboard/:type/score', auth_1.authMiddleware, leaderboard_1.updateScore);
// ===== 邮件模块 (需要认证) =====
app.get('/api/mail/:userId', auth_1.authMiddleware, mail_1.getMails);
app.get('/api/mail/:userId/:mailId', auth_1.authMiddleware, mail_1.getMailDetail);
app.post('/api/mail/:userId/read', auth_1.authMiddleware, mail_1.markAsRead);
app.post('/api/mail/:userId/claim', auth_1.authMiddleware, mail_1.claimAttachments);
app.post('/api/mail/:userId/delete', auth_1.authMiddleware, mail_1.deleteMail);
// 系统邮件接口（管理员用）
app.post('/api/admin/mail/send', mail_1.sendMail);
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
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
});
// 启动服务器
async function startServer() {
    // 初始化数据库
    try {
        await (0, db_1.initDatabase)();
        console.log('✅ Database initialized');
    }
    catch (error) {
        console.error('❌ Database initialization failed:', error);
    }
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
}
startServer();
//# sourceMappingURL=app.js.map