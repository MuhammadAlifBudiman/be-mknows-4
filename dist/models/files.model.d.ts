import { Sequelize, Model, Optional } from "sequelize";
import { File } from "../interfaces/file.interface";
export type FileCreationAttributes = Optional<File, "pk" | "uuid">;
export declare class FileModel extends Model<File, FileCreationAttributes> implements File {
    pk: number;
    uuid: string;
    name: string;
    user_id: number;
    type: string;
    size: number;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default function (sequelize: Sequelize): typeof FileModel;
