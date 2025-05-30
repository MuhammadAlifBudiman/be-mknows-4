import { Routes } from "../interfaces/routes.interface";
import { ArticleController } from "../controllers/article.controller";
export declare class ArticleRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    article: ArticleController;
    constructor();
    private initializeRoutes;
}
