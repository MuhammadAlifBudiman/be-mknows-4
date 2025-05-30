import { Response, NextFunction } from "express";
import { RequestWithUser } from "../interfaces/authentication/token.interface";
export declare const AuthorizedRoles: (roles: string[]) => (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>;
export declare const AuthMiddleware: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>;
