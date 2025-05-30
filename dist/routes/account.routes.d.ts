import { Routes } from "../interfaces/routes.interface";
import { AccountController } from "../controllers/account.controller";
export declare class AccountRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    account: AccountController;
    constructor();
    private initializeRoutes;
}
