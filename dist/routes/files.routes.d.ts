import { Routes } from "../interfaces/routes.interface";
import { FileController } from "../controllers/file.controller";
export declare class FileRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    file: FileController;
    constructor();
    private initializeRoutes;
}
