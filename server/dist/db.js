"use strict";
/**
 * 数据库连接配置
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = query;
exports.transaction = transaction;
const promise_1 = __importDefault(require("mysql2/promise"));
const pool = promise_1.default.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'memory_collector',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
async function query(sql, params) {
    const [rows] = await pool.execute(sql, params);
    return rows;
}
async function transaction(callback) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
        const result = await callback(connection);
        await connection.commit();
        return result;
    }
    catch (error) {
        await connection.rollback();
        throw error;
    }
    finally {
        connection.release();
    }
}
exports.default = pool;
//# sourceMappingURL=db.js.map