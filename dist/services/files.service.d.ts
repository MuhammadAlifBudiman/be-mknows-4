/// <reference types="multer" />
import { File } from "../interfaces/file.interface";
export declare class FileService {
    uploadSingleFile(user_id: number, file: Express.Multer.File): Promise<File>;
    getFileWithUUID(file_uuid: string): Promise<File>;
    getUserFiles(user_id: number): Promise<File[]>;
}
