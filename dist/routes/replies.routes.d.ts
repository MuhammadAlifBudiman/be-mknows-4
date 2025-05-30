import { Routes } from "../interfaces/routes.interface";
import { ReplyController } from "../controllers/reply.controller";
export declare class ReplyRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    controller: ReplyController;
    constructor();
    private initializeRoutes;
}
