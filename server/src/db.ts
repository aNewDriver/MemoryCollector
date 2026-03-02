/**
 * 数据库连接模块
 */

import mysql from 'mysql2/promise';

// 数据库配置
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'game_user',
    password: process.env.DB_PASSWORD || 'game_pass_123',
    database: process.env.DB_NAME || 'memory_collector',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// 创建连接池
const pool = mysql.createPool(dbConfig);

// 测试连接
export async function testConnection(): Promise<boolean> {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
}

// 初始化数据库表
export async function initDatabase(): Promise<void> {
    const connection = await pool.getConnection();
    try {
        // 用户表
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(64) PRIMARY KEY,
                username VARCHAR(64) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                email VARCHAR(128),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP NULL,
                is_guest BOOLEAN DEFAULT FALSE
            )
        `);

        // 存档表
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS saves (
                user_id VARCHAR(64) PRIMARY KEY,
                version INT DEFAULT 1,
                data JSON NOT NULL,
                timestamp BIGINT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 排行榜表
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS leaderboard (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id VARCHAR(64) NOT NULL,
                type VARCHAR(32) NOT NULL,
                score BIGINT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY unique_user_type (user_id, type),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 邮件表
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS mails (
                id VARCHAR(64) PRIMARY KEY,
                user_id VARCHAR(64) NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT,
                attachments JSON,
                is_read BOOLEAN DEFAULT FALSE,
                is_claimed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expire_at TIMESTAMP NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 公会表
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS guilds (
                id VARCHAR(64) PRIMARY KEY,
                name VARCHAR(64) NOT NULL,
                level INT DEFAULT 1,
                exp INT DEFAULT 0,
                leader_id VARCHAR(64) NOT NULL,
                members JSON NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (leader_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 聊天记录表
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS chat_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                channel VARCHAR(32) NOT NULL,
                user_id VARCHAR(64) NOT NULL,
                username VARCHAR(64) NOT NULL,
                message TEXT NOT NULL,
                timestamp BIGINT NOT NULL,
                INDEX idx_channel_time (channel, timestamp)
            )
        `);

        console.log('✅ Database tables initialized');
    } finally {
        connection.release();
    }
}

export default pool;
