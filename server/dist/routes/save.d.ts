/**
 * 存档管理模块
 */
import { Request, Response } from 'express';
export declare function getSave(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function saveGame(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteSave(req: Request, res: Response): Promise<void>;
export declare function listSaves(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=save.d.ts.map