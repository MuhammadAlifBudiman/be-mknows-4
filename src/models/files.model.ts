/**
 * Sequelize model definition for files.
 * Represents file entities uploaded by users, including metadata and storage info.
 */
import { Sequelize, DataTypes, Model, Optional } from "sequelize";

import { File } from "@interfaces/file.interface";

/**
 * Type for file creation attributes, omitting pk and uuid for auto-generation.
 */
export type FileCreationAttributes = Optional<File, "pk" | "uuid">;

/**
 * FileModel class for Sequelize ORM.
 * Implements File interface. Attributes are handled by Sequelize.
 */
export class FileModel extends Model<File, FileCreationAttributes> {
  // No public fields here! Let Sequelize handle attributes.
}

/**
 * Initializes the FileModel with Sequelize instance and sets up model fields.
 * @param sequelize - Sequelize connection instance
 * @returns FileModel class
 */
export default function (sequelize: Sequelize): typeof FileModel {
  FileModel.init(
    {
      pk: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: UserModel, key: "pk"
        // onDelete/onUpdate: "CASCADE"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "files", // Table name in DB
      timestamps: true,    // Enable created_at/updated_at
      paranoid: true,      // Enable soft deletes (deleted_at)
      sequelize            // Sequelize instance
    },
  );

  return FileModel;
}