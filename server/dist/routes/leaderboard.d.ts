/**
 * 排行榜模块
 */
import { Request, Response } from 'express';
export declare function getLeaderboard(req: Request, res: Response): Promise<void>;
export declare function updateScore(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getLeaderboardTypes(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=leaderboard.d.ts.map