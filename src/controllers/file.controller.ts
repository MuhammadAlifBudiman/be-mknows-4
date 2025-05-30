import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { Container } from "typedi";

import { FileService } from "@services/files.service";
import { RequestWithUser } from "@interfaces/authentication/token.interface";

import { apiResponse } from "@utils/apiResponse";
import { HttpException } from "@/exceptions/HttpException";

export class FileController {
  private file = Container.get(FileService);

  public uploadFile = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const image = req.file as Express.Multer.File;
    const user_id = req.user.pk as number;

    if(!image) throw new HttpException(false, 400, "File is required");

    const response = await this.file.uploadSingleFile(user_id, image);
    res.status(201).json(apiResponse(201, "OK", "Upload Success", response));
  });

  public getFileWithUUID = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { file_id } = req.params;
    const file = await this.file.getFileWithUUID(file_id);
    if (!file || !file.url) {
      throw new HttpException(false, 400, "File is not found");
    }
    // Redirect to S3 URL or return the URL
    res.redirect(file.url);
    // Or: res.json({ url: file.url });
  });

  public getFileMine = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user_id = req.user.pk as number;
    const response = await this.file.getUserFiles(user_id);

    res.status(200).json(apiResponse(200, "OK", "Get Files Success", response));
  });
}