import { Routes } from "../interfaces/routes.interface";
import { AuthController } from "../controllers/auth.controller";
export declare class AuthRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    auth: AuthController;
    constructor();
    private initializeRoutes;
}
