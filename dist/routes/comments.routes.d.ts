import { CommentController } from "../controllers/comment.controller";
import { Routes } from "../interfaces/routes.interface";
export declare class CommentRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    controller: CommentController;
    constructor();
    private initializeRoutes;
}
