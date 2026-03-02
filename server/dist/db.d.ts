/**
 * 数据库连接模块
 */
import mysql from 'mysql2/promise';
declare const pool: mysql.Pool;
export declare function testConnection(): Promise<boolean>;
export declare function initDatabase(): Promise<void>;
export default pool;
//# sourceMappingURL=db.d.ts.map