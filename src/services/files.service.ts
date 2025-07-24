// Import Service decorator from typedi for dependency injection
import { Service } from "typedi";
// Import function to get database instance lazily
import { getDB } from "@/database/db-lazy";
// Import File interface for file data structure
import { File } from "@interfaces/file.interface";
// Import custom HTTP exception for error handling
import { HttpException } from "@/exceptions/HttpException";
// Import environment variable to determine file storage strategy
import { NODE_ENV } from "@config/index";

/**
 * Service class for file-related operations.
 * Handles file upload, retrieval by UUID, and user file listing.
 */
@Service()
export class FileService {
  /**
   * Uploads a single file for a user and stores its metadata in the database.
   * @param user_id - The user's ID who uploads the file.
   * @param file - The uploaded file object from Multer.
   * @returns Promise<File> - The uploaded file's metadata.
   */
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
  
  /**
   * Retrieves a file's metadata by its UUID.
   * @param file_uuid - The UUID of the file.
   * @returns Promise<File> - The file's metadata (name and URL).
   * @throws HttpException if file is not found.
   */
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

  /**
   * Retrieves all files uploaded by a specific user.
   * @param user_id - The user's ID.
   * @returns Promise<File[]> - Array of file metadata objects.
   */
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