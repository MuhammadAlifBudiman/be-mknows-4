import "reflect-metadata";
import express from "express";
import { Routes } from "./interfaces/routes.interface";
import RateLimitter from "./middlewares/rate-limitter.middleware";
export declare class App {
    app: express.Application;
    limit: RateLimitter;
    private readonly env;
    private readonly port;
    constructor(routes: Routes[]);
    listen(): void;
    getServer(): express.Application;
    private connectToDatabase;
    private initialize;
    private initializeMiddlewares;
    private initializeRoutes;
    private initializeErrorHandling;
    private initializeRateLimitter;
}
