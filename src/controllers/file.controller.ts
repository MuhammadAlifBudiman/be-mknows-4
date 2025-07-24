/**
 * FileController handles file upload and retrieval operations.
 * Uses FileService for business logic and apiResponse for standardized responses.
 */
import fs from "fs"; // Node.js file system module
import path from "path"; // Node.js path module
import { Request, Response, NextFunction } from "express"; // Express types for request handling
import asyncHandler from "express-async-handler"; // Async error handler middleware
import { Container } from "typedi"; // Dependency injection container

import { FileService } from "@services/files.service"; // Service for file logic
import { RequestWithUser } from "@interfaces/authentication/token.interface"; // Authenticated request interface

import { apiResponse } from "@utils/apiResponse"; // Standardized API response
import { HttpException } from "@/exceptions/HttpException"; // Custom HTTP exception

import { NODE_ENV } from "@config/index"; // Environment variable

/**
 * Main controller class for file endpoints
 */
export class FileController {
  /**
   * FileService instance for file operations
   */
  private file = Container.get(FileService);

  /**
   * Upload a single file for the authenticated user
   * @param req - Express request containing file and user info
   * @param res - Express response
   * @param next - Express next middleware
   */
  public uploadFile = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const image = req.file as Express.Multer.File;
    const user_id = req.user.pk as number;

    if(!image) throw new HttpException(false, 400, "File is required");

    const response = await this.file.uploadSingleFile(user_id, image);
    res.status(201).json(apiResponse(201, "OK", "Upload Success", response));
  });

  /**
   * Retrieve a file by its UUID
   * @param req - Express request containing file ID
   * @param res - Express response
   * @param next - Express next middleware
   */
  public getFileWithUUID = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { file_id } = req.params;
    const file = await this.file.getFileWithUUID(file_id);
    if (!file || !file.url) {
      throw new HttpException(false, 400, "File is not found");
    }
    if (NODE_ENV === 'production') {
      res.redirect(file.url); // Redirect to file URL in production
    } else {
      // Local: send file from uploads directory
      const filepath = path.join(process.cwd(), `./uploads/${file.name}`);
      res.sendFile(filepath);
    }
  });

  /**
   * Get all files uploaded by the authenticated user
   * @param req - Express request containing user info
   * @param res - Express response
   * @param next - Express next middleware
   */
  public getFileMine = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user_id = req.user.pk as number;
    const response = await this.file.getUserFiles(user_id);

    res.status(200).json(apiResponse(200, "OK", "Get Files Success", response));
  });
}