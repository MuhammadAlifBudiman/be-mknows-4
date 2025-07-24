/**
 * Sequelize model definition for article likes.
 * Represents the relationship between users and articles they have liked.
 */
import { Sequelize, DataTypes, Model } from "sequelize";

import { ArticleModel } from "@models/articles.model";
import { UserModel } from "@models/users.model";

import { ArticleLike } from "@interfaces/article.interface";

/**
 * Type for article like creation attributes.
 */
export type ArticleLikeCreationAttributes = ArticleLike;

/**
 * ArticleLikeModel class for Sequelize ORM.
 * Implements ArticleLike interface and adds timestamp fields.
 */
export class ArticleLikeModel extends Model<ArticleLike, ArticleLikeCreationAttributes> implements ArticleLike {
  public article_id: number; // ID of the liked article
  public user_id: number;    // ID of the user who liked the article

  public readonly created_at!: Date; // Timestamp for creation
  public readonly updated_at!: Date; // Timestamp for last update
  public readonly deleted_at: Date;  // Timestamp for deletion (paranoid)
}

/**
 * Initializes the ArticleLikeModel with Sequelize instance.
 * @param sequelize - Sequelize connection instance
 * @returns ArticleLikeModel class
 */
export default function (sequelize: Sequelize): typeof ArticleLikeModel {
  ArticleLikeModel.init(
    {
      article_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "articles_likes", // Table name in DB
      timestamps: true,                // Enable created_at/updated_at
      paranoid: true,                  // Enable soft deletes (deleted_at)
      sequelize,                       // Sequelize instance
    },
  );

  return ArticleLikeModel;
}