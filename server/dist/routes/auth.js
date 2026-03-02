"use strict";
/**
 * 用户认证模块
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.guestLogin = guestLogin;
exports.verifyToken = verifyToken;
exports.authMiddleware = authMiddleware;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const db_1 = __importDefault(require("../db"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
// 注册
async function register(req, res) {
    try {
        const { username, password, email } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, error: 'Username and password required' });
        }
        // 检查用户名是否存在
        const [existing] = await db_1.default.execute('SELECT id FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(409).json({ success: false, error: 'Username already exists' });
        }
        // 加密密码
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const userId = (0, uuid_1.v4)();
        // 创建用户
        await db_1.default.execute('INSERT INTO users (id, username, password_hash, email) VALUES (?, ?, ?, ?)', [userId, username, passwordHash, email || null]);
        // 生成JWT
        const token = jsonwebtoken_1.default.sign({ userId, username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.json({
            success: true,
            userId,
            token,
            expiresIn: JWT_EXPIRES_IN
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
// 登录
async function login(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, error: 'Username and password required' });
        }
        // 查询用户
        const [rows] = await db_1.default.execute('SELECT id, username, password_hash FROM users WHERE username = ?', [username]);
        const users = rows;
        if (users.length === 0) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        const user = users[0];
        // 验证密码
        const isValid = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        // 更新最后登录时间
        await db_1.default.execute('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
        // 生成JWT
        const token = jsonwebtoken_1.default.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.json({
            success: true,
            userId: user.id,
            token,
            expiresIn: JWT_EXPIRES_IN
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
// 游客登录
async function guestLogin(req, res) {
    try {
        const userId = (0, uuid_1.v4)();
        const username = `Guest_${Date.now().toString(36)}`;
        await db_1.default.execute('INSERT INTO users (id, username, password_hash, is_guest) VALUES (?, ?, ?, ?)', [userId, username, '', true]);
        const token = jsonwebtoken_1.default.sign({ userId, username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.json({
            success: true,
            userId,
            username,
            token,
            isGuest: true
        });
    }
    catch (error) {
        console.error('Guest login error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
// 验证Token
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch {
        return null;
    }
}
// 认证中间件
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ success: false, error: 'No token provided' });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
    }
    req.user = decoded;
    next();
}
//# sourceMappingURL=auth.js.map