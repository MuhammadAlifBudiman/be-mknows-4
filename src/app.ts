import "reflect-metadata";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import userAgent from "express-useragent";
import requestIp from "request-ip";
import fs from "fs";
import path from "path";

import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from "@config/index";
import { DB } from "@database";
import { Routes } from "@interfaces/routes.interface";
import { ErrorMiddleware } from "@middlewares/error.middleware";
import RateLimitter from "@middlewares/rate-limitter.middleware";

import { logger, stream } from "@utils/logger";

export class App {
  public app: express.Application;
  public limit = new RateLimitter();

  private readonly env: string;
  private readonly port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || "development";
    this.port = PORT || 3000;

    // Ensure uploads directory exists at startup
    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Wait for DB to be ready before continuing
    this.initialize().then(() => {
      this.initializeRateLimitter();
      this.initializeMiddlewares();
      this.initializeRoutes(routes);
      this.initializeErrorHandling();
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info("=================================");
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    // Dynamically require 'pg' to avoid issues if not installed in production
    const { Client } = require('pg');
    const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

    // Connect to the default 'postgres' database
    const client = new Client({
      host: DB_HOST,
      port: DB_PORT ? Number(DB_PORT) : undefined,
      user: DB_USER,
      password: DB_PASSWORD,
      database: 'postgres',
    });

    try {
      await client.connect();
      // Check if the target database exists
      const res = await client.query(
        'SELECT 1 FROM pg_database WHERE datname = $1',
        [DB_DATABASE]
      );
      if (res.rowCount === 0) {
        // Database does not exist, create it
        await client.query(`CREATE DATABASE "${DB_DATABASE}"`);
        logger.info(`Database '${DB_DATABASE}' created successfully.`);
      } else {
        logger.info(`Database '${DB_DATABASE}' already exists.`);
      }
    } catch (err: any) {
      logger.error('Error checking/creating database: ' + err.message);
      process.exit(1);
    } finally {
      await client.end();
    }
  }

  private async initialize() {
    // Wait for DB to be ready and sync models
    while (!DB || !DB.sequelize) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    await DB.sequelize.sync({ alter: true, force: false });
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json({ limit: "200mb", type: "application/json" }))
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(requestIp.mw());
    this.app.use(userAgent.express());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use("/", route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }

  private initializeRateLimitter() {
    this.app.use(this.limit.default());
  }
}