/**
 * Sequelize model definition for articles.
 * Represents articles created by users, including associations and scopes for related entities.
 */
import { Sequelize, DataTypes, Model, Optional } from "sequelize";

import { User } from "@interfaces/user.interface";
import { File } from "@interfaces/file.interface";
import { Article } from "@interfaces/article.interface";
import { ArticleCategory } from "@interfaces/article.interface";

import { UserModel } from "@models/users.model";
import { FileModel } from "@models/files.model";
import { CategoryModel } from '@models/categories.model';
import { ArticleCategoryModel } from '@models/articles_categories.model';

/**
 * Type for article creation attributes, omitting pk and uuid for auto-generation.
 */
export type ArticleCreationAttributes = Optional<Article, "pk" | "uuid">;

/**
 * ArticleModel class for Sequelize ORM.
 * Implements Article interface and adds timestamp fields.
 */
export class ArticleModel extends Model<Article, ArticleCreationAttributes> {
  public readonly created_at!: Date; // Timestamp for creation
  public readonly updated_at!: Date; // Timestamp for last update
  public readonly deleted_at: Date;  // Timestamp for deletion (paranoid)
}

/**
 * Initializes the ArticleModel with Sequelize instance and sets up associations and scopes.
 * @param sequelize - Sequelize connection instance
 * @returns ArticleModel class
 */
export default function (sequelize: Sequelize): typeof ArticleModel {
  ArticleModel.init(
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      thumbnail_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: FileModel, key: "pk"
        // onDelete/onUpdate: "CASCADE"
      },  
      author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: UserModel, key: "pk"
        // onDelete/onUpdate: "CASCADE"
      },
    },
    {
      tableName: "articles", // Table name in DB
      timestamps: true,       // Enable created_at/updated_at
      paranoid: true,         // Enable soft deletes (deleted_at)
      sequelize,              // Sequelize instance
      defaultScope: {
        include: [
          {
            attributes: ["uuid"],
            model: FileModel,
            as: "thumbnail",
          },
          {
            attributes: ["uuid", "full_name", "display_picture"],
            model: UserModel,
            as: "author",
            include: [
              {
                attributes: ["uuid"],
                model: FileModel,
                as: "avatar"
              }
            ]
          },
          {
            attributes: ["category_id"],
            model: ArticleCategoryModel,
            as: "categories",
            include: [{
              attributes: ["uuid", "name", "description"],
              model: CategoryModel, 
              as: "category"
            }]
          }
        ],
      }
    },
  );

  // Set up associations for thumbnail, author, and categories
  FileModel.hasOne(ArticleModel, {
    foreignKey: "thumbnail_id",
    as: "thumbnail"
  });

  ArticleModel.belongsTo(FileModel, {
    foreignKey: "thumbnail_id",
    as: "thumbnail"
  });

  UserModel.hasMany(ArticleModel, {
    foreignKey: "author_id",
    as: "author"
  });

  ArticleModel.belongsTo(UserModel, {
    foreignKey: "author_id",
    as: "author"
  });

  return ArticleModel;
}