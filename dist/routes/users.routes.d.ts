import { Routes } from "../interfaces/routes.interface";
import { UserController } from "../controllers/user.controller";
import Limitter from "../middlewares/rate-limitter.middleware";
export declare class UserRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    user: UserController;
    limitter: Limitter;
    constructor();
    private initializeRoutes;
}
