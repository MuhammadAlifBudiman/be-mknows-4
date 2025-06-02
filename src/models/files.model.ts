import { Sequelize, DataTypes, Model, Optional } from "sequelize";

import { File } from "@interfaces/file.interface";

export type FileCreationAttributes = Optional<File, "pk" | "uuid">;

export class FileModel extends Model<File, FileCreationAttributes> {
  // No public fields here! Let Sequelize handle attributes.
}

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
        // references: {
        //   model: UserModel,
        //   key: "pk",
        // },
        // onDelete: "CASCADE",
        // onUpdate: "CASCADE",
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
      tableName: "files",
      timestamps: true,
      paranoid: true,
      sequelize
    },
  );

  return FileModel;
}