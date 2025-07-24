/**
 * Sequelize model definition for article bookmarks.
 * Represents the relationship between users and articles they have bookmarked.
 */
import { Sequelize, DataTypes, Model } from "sequelize";
import { ArticleBookmark } from "@interfaces/article.interface";

/**
 * Type for article bookmark creation attributes.
 */
export type ArticleBookmarkCreationAttributes = ArticleBookmark;

/**
 * ArticleBookmarkModel class for Sequelize ORM.
 * Implements ArticleBookmark interface and adds timestamp fields.
 */
export class ArticleBookmarkModel extends Model<ArticleBookmark, ArticleBookmarkCreationAttributes> implements ArticleBookmark {
  public article_id: number; // ID of the bookmarked article
  public user_id: number;    // ID of the user who bookmarked

  public readonly created_at!: Date; // Timestamp for creation
  public readonly updated_at!: Date; // Timestamp for last update
  public readonly deleted_at: Date;  // Timestamp for deletion (paranoid)
}

/**
 * Initializes the ArticleBookmarkModel with Sequelize instance.
 * @param sequelize - Sequelize connection instance
 * @returns ArticleBookmarkModel class
 */
export default function (sequelize: Sequelize): typeof ArticleBookmarkModel {
  ArticleBookmarkModel.init(
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
      tableName: "articles_bookmarks", // Table name in DB
      timestamps: true,                // Enable created_at/updated_at
      paranoid: true,                  // Enable soft deletes (deleted_at)
      sequelize,                       // Sequelize instance
    },
  );

  return ArticleBookmarkModel;
}