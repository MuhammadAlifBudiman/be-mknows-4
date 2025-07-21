import { Service } from "typedi";
import { getDB } from "@/database/db-lazy";

import { File } from "@interfaces/file.interface";
import { HttpException } from "@/exceptions/HttpException";
import { NODE_ENV } from "@config/index";

@Service()
export class FileService {
  public async uploadSingleFile(user_id: number, file: Express.Multer.File): Promise<File> {
    const DB = await getDB();
    const isProduction = NODE_ENV === 'production';
    const fileUrl = isProduction
      ? (file as any).location || null
      : `/uploads/${file.filename}`;
    const fileName = isProduction ? file.originalname : file.filename;

    const fileData = {
      user_id,
      name: fileName,
      type: file.mimetype,
      size: file.size,
      url: fileUrl,
    };

    const fileUpload = await DB.Files.create(fileData);

    delete fileUpload.dataValues.pk;
    delete fileUpload.dataValues.name;
    delete fileUpload.dataValues.user_id;

    return fileUpload;
  };
  
  public async getFileWithUUID(file_uuid: string): Promise<File> {
    const DB = await getDB();
    const file = await DB.Files.findOne({
      attributes: ["name", "url"],
      where: {
        uuid: file_uuid
      }
    });

    if(!file) throw new HttpException(false, 400, "File is not found");
    return file;
  };

  public async getUserFiles(user_id: number): Promise<File[]> {
    const DB = await getDB();
    const files = await DB.Files.findAll({
      attributes: { exclude: ["pk", "user_id", "name"] },
      where: {
        user_id
      }
    });

    return files;
  };
};