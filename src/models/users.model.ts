/**
 * Sequelize model definition for users.
 * Represents user entities with personal and authentication fields, including associations for avatar images.
 */
import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { User } from "@interfaces/user.interface";

import { FileModel } from "@models/files.model";
import { UserRole } from '@interfaces/authentication/user-role.interface';

/**
 * Type for user creation attributes, omitting pk, uuid, full_name, and display_picture for auto-generation.
 */
export type UserCreationAttributes = Optional<User, "pk" | "uuid" | "full_name" | "display_picture">;

/**
 * UserModel class for Sequelize ORM.
 * Implements User interface. Attributes are handled by Sequelize.
 */
export class UserModel extends Model<User, UserCreationAttributes> implements User {

}

// Declaration merging: this tells TypeScript that UserModel instances have User properties
export interface UserModel extends User {}

/**
 * Initializes the UserModel with Sequelize instance and sets up model fields and associations.
 * @param sequelize - Sequelize connection instance
 * @returns UserModel class
 */
export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      pk: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      display_picture: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: "users", // Table name in DB
      timestamps: true,    // Enable created_at/updated_at
      paranoid: true,      // Enable soft deletes (deleted_at)
      sequelize,           // Sequelize instance
      defaultScope: {
        attributes: { exclude: ["password"] }, // Exclude password from queries
      },
    },
  );

  // Set up associations for avatar images
  FileModel.hasOne(UserModel, {
    foreignKey: "display_picture",
    as: "avatar"
  });

  UserModel.belongsTo(FileModel, {
    foreignKey: "display_picture",
    as: "avatar"
  });

  return UserModel;
}