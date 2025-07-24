/**
 * Middleware for handling file uploads using multer and AWS S3.
 * Supports local disk storage in development and S3 in production.
 * Validates file type and size, and uploads to S3 if configured.
 */
import { Request } from "express"; // Express request type
import multer from "multer"; // Multer for file uploads
import AWS from "aws-sdk"; // AWS SDK for S3

import { HttpException } from "@exceptions/HttpException"; // Custom HTTP exception
import { MAX_SIZE_FILE_UPLOAD, NODE_ENV } from "@config/index"; // Config values

// AWS S3 config
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const S3_BUCKET = process.env.AWS_S3_BUCKET;

/**
 * Multer middleware for file upload.
 * - Limits: max 10 files, max size from config
 * - Storage: S3 (memory) in production, disk in development
 * - File filter: only image and application types (jpg, jpeg, png)
 */
export const uploadFile = multer({
  limits: {
    files: 10,
    fileSize: Number(MAX_SIZE_FILE_UPLOAD),
  },
  storage:
    NODE_ENV === 'production'
      ? multer.memoryStorage()
      : multer.diskStorage({
          destination: (req, file, cb) => {
            cb(null, 'uploads/');
          },
          filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname);
          },
        }),
  /**
   * File filter to allow only specific mimetypes
   */
  fileFilter(req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) {
    if (!file.mimetype.match(/^image|application\/(jpg|jpeg|png)$/)) {
      return callback(new HttpException(false, 400, "Invalid File Format"));
    }
    callback(null, true);
  },
});

/**
 * Middleware to upload a file to AWS S3 after multer processes it.
 * Adds the S3 file URL to req.file.location on success.
 */
export const uploadToS3 = async (req: Request, res, next) => {
  if (!req.file) return next();
  const params = {
    Bucket: S3_BUCKET,
    Key: `${Date.now()}-${req.file.originalname}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
    ACL: "public-read",
  };
  try {
    const data = await s3.upload(params).promise();
    (req.file as any).location = data.Location; // S3 file URL
    next();
  } catch (err) {
    next(new HttpException(false, 500, "S3 Upload Failed"));
  }
};