// Import Router from Express to define route handlers
import { Router } from "express";
// Import the Routes interface for consistent route structure
import { Routes } from "@interfaces/routes.interface";
// Import the FileController to handle file-related logic
import { FileController } from "@controllers/file.controller";
// Import authentication middleware to protect file routes
import { AuthMiddleware } from "@middlewares/auth.middleware";
// Import file upload middlewares for local and S3 uploads
import { uploadFile, uploadToS3 } from "@middlewares/file-uploader.middleware";
// Import environment variable to determine upload strategy
import { NODE_ENV } from "@config/index";

/**
 * Route definition class for file-related endpoints.
 * Implements the Routes interface to provide path, router, and controller.
 */
export class FileRoute implements Routes {
  /**
   * The base path for file routes.
   * @type {string}
   */
  public path = "files";
  /**
   * Express router instance for file routes.
   * @type {Router}
   */
  public router = Router();
  /**
   * Controller instance to handle file logic.
   * @type {FileController}
   */
  public file = new FileController();

  /**
   * Initializes the file route and sets up endpoints.
   */
  constructor() {
    this.initializeRoutes();
  }

  /**
   * Defines all file-related endpoints and their middlewares.
   *
   * - POST /v1/files/upload: Upload a file (auth, upload middleware, S3 in production)
   * - GET /v1/files/:file_id/preview: Preview a file by its UUID (auth)
   * - GET /v1/files/mine: Get files uploaded by the authenticated user (auth)
   */
  private initializeRoutes() {
    /**
     * Selects upload middlewares based on environment:
     * - Production: Auth, local upload, then S3 upload
     * - Development: Auth, local upload only
     */
    const uploadMiddlewares =
      NODE_ENV === "production"
        ? [AuthMiddleware, uploadFile.single("file"), uploadToS3]
        : [AuthMiddleware, uploadFile.single("file")];

    // Route for uploading a file
    this.router.post(
      `/v1/${this.path}/upload`,
      ...uploadMiddlewares,
      this.file.uploadFile
    );
    // Route for previewing a file by its UUID
    this.router.get(
      `/v1/${this.path}/:file_id/preview`, 
      AuthMiddleware, 
      this.file.getFileWithUUID
    );
    // Route for retrieving files uploaded by the authenticated user
    this.router.get(
      `/v1/${this.path}/mine`, 
      AuthMiddleware, 
      this.file.getFileMine
    );
  }
}