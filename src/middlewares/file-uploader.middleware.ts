import { Request } from "express";
import multer from "multer";
import AWS from "aws-sdk";

import { HttpException } from "@exceptions/HttpException";
import { MAX_SIZE_FILE_UPLOAD } from "@config/index";

// AWS S3 config
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const S3_BUCKET = process.env.AWS_S3_BUCKET;

export const uploadFile = multer({
  limits: {
    files: 10,
    fileSize: Number(MAX_SIZE_FILE_UPLOAD),
  },
  storage: multer.memoryStorage(), // store in memory, not disk
  fileFilter(req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) {
    if (!file.mimetype.match(/^image|application\/(jpg|jpeg|png)$/)) {
      return callback(new HttpException(false, 400, "Invalid File Format"));
    }
    callback(null, true);
  },
});

// Middleware to upload to S3 after multer
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