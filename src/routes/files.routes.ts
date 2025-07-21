import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";

import { FileController } from "@controllers/file.controller";

import { AuthMiddleware } from "@middlewares/auth.middleware";
import { uploadFile, uploadToS3 } from "@middlewares/file-uploader.middleware";

import { NODE_ENV } from "@config/index";

export class FileRoute implements Routes {
  public path = "files";
  public router = Router();
  public file = new FileController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const uploadMiddlewares =
      NODE_ENV === "production"
        ? [AuthMiddleware, uploadFile.single("file"), uploadToS3]
        : [AuthMiddleware, uploadFile.single("file")];

    this.router.post(
      `/v1/${this.path}/upload`,
      ...uploadMiddlewares,
      this.file.uploadFile
    );
    this.router.get(
      `/v1/${this.path}/:file_id/preview`, 
      AuthMiddleware, 
      this.file.getFileWithUUID
    );
    this.router.get(
      `/v1/${this.path}/mine`, 
      AuthMiddleware, 
      this.file.getFileMine
    );
  }
}