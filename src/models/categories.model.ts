/**
 * Sequelize model definition for categories.
 * Represents category entities with name and description fields.
 */
import { Sequelize, DataTypes, Model, Optional } from "sequelize";

import { Category } from "@interfaces/category.interface";

/**
 * Type for category creation attributes, omitting pk and uuid for auto-generation.
 */
export type CategoryCreationAttributes = Optional<Category, "pk" | "uuid">;

/**
 * CategoryModel class for Sequelize ORM.
 * Implements Category interface and adds timestamp fields.
 */
export class CategoryModel extends Model<Category, CategoryCreationAttributes> {
  public readonly created_at!: Date; // Timestamp for creation
  public readonly updated_at!: Date; // Timestamp for last update
  public readonly deleted_at: Date;  // Timestamp for deletion (paranoid)
}

/**
 * Initializes the CategoryModel with Sequelize instance.
 * @param sequelize - Sequelize connection instance
 * @returns CategoryModel class
 */
export default function (sequelize: Sequelize): typeof CategoryModel {
  CategoryModel.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "categories", // Table name in DB
      timestamps: true,         // Enable created_at/updated_at
      paranoid: true,           // Enable soft deletes (deleted_at)
      sequelize                 // Sequelize instance
    },
  );

  return CategoryModel;
}