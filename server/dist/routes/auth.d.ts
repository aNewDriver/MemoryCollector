/**
 * 用户认证模块
 */
import { Request, Response } from 'express';
export declare function register(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function login(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function guestLogin(req: Request, res: Response): Promise<void>;
export declare function verifyToken(token: string): any;
export declare function authMiddleware(req: Request, res: Response, next: any): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map