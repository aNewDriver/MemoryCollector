/**
 * 数据库连接配置
 */
import mysql from 'mysql2/promise';
declare const pool: mysql.Pool;
export declare function query(sql: string, params?: any[]): Promise<any>;
export declare function transaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T>;
export default pool;
//# sourceMappingURL=db.d.ts.map