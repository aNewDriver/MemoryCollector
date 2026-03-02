/**
 * 邮件系统模块
 */
import { Request, Response } from 'express';
export declare function getMails(req: Request, res: Response): Promise<void>;
export declare function getMailDetail(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function markAsRead(req: Request, res: Response): Promise<void>;
export declare function claimAttachments(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function sendMail(req: Request, res: Response): Promise<void>;
export declare function deleteMail(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=mail.d.ts.map