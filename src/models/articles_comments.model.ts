/**
 * Sequelize model definition for article comments.
 * Represents comments made by users on articles, including associations and scopes.
 */
// src/models/article-comments.model.ts
import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { Comment } from "@/interfaces/comment.interface";
import { UserModel } from "./users.model";
import { FileModel } from "./files.model";
import { User } from "@/interfaces/user.interface";
import { Article } from "@/interfaces/article.interface";
import { ArticleModel } from "./articles.model";

/**
 * Type for article comment creation attributes, omitting pk and uuid for auto-generation.
 */
export type ArticleCommentCreationAttributes = Optional<Comment, "pk" | "uuid">;

/**
 * ArticleCommentModel class for Sequelize ORM.
 * Implements Comment interface and adds associations and timestamp fields.
 */
export class ArticleCommentModel extends Model<Comment, ArticleCommentCreationAttributes> implements Comment {
  public pk: number;              // Primary key
  public uuid: string;            // Unique identifier
  public article_id: number;      // Associated article ID
  public author_id: number;       // Author's user ID
  public comment: string;         // Comment text

  public readonly article: Article; // Associated article object
  public readonly author: User;     // Associated author object

  public replies: number;         // Number of replies
  public likes: number;           // Number of likes

  public readonly created_at!: Date; // Timestamp for creation
  public readonly updated_at!: Date; // Timestamp for last update
  public readonly deleted_at: Date;  // Timestamp for deletion (paranoid)
}

/**
 * Initializes the ArticleCommentModel with Sequelize instance and sets up associations and scopes.
 * @param sequelize - Sequelize connection instance
 * @returns ArticleCommentModel class
 */
export default function (sequelize: Sequelize): typeof ArticleCommentModel {
  ArticleCommentModel.init(
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
      article_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      author_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "articles_comments", // Table name in DB
      timestamps: true,                // Enable created_at/updated_at
      paranoid: true,                  // Enable soft deletes (deleted_at)
      sequelize,                       // Sequelize instance
      defaultScope: {
        include: [
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
            attributes: ["uuid", "title"],
            model: ArticleModel,
            as: "article",
          },
        ]
      }
    },
  );

  // Set up associations
  ArticleModel.hasMany(ArticleCommentModel, { foreignKey: "article_id", as: "comments" });
  ArticleCommentModel.belongsTo(ArticleModel, { foreignKey: "article_id", as: "article" });
  ArticleCommentModel.belongsTo(UserModel, { foreignKey: "author_id", as: "author" });

  return ArticleCommentModel;
}
