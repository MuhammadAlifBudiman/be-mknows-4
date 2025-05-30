import { Request } from "express";
import { UserAgent as UserAgentInterface } from "../interfaces/common/useragent.interface";
export declare const getUserAgent: (req: Request) => UserAgentInterface;
