/**
 * Sequelize model definition for article views.
 * Represents the relationship between users and articles they have viewed.
 */
import { Sequelize, DataTypes, Model } from "sequelize";

import { ArticleView } from "@interfaces/article.interface";

/**
 * Type for article view creation attributes.
 */
export type ArticleViewCreationAttributes = ArticleView;

/**
 * ArticleViewModel class for Sequelize ORM.
 * Implements ArticleView interface and adds timestamp fields.
 */
export class ArticleViewModel extends Model<ArticleView, ArticleViewCreationAttributes> implements ArticleView {
  public article_id: number; // ID of the viewed article
  public user_id: number;    // ID of the user who viewed the article

  public readonly created_at!: Date; // Timestamp for creation
  public readonly updated_at!: Date; // Timestamp for last update
  public readonly deleted_at: Date;  // Timestamp for deletion (paranoid)
}

/**
 * Initializes the ArticleViewModel with Sequelize instance.
 * @param sequelize - Sequelize connection instance
 * @returns ArticleViewModel class
 */
export default function (sequelize: Sequelize): typeof ArticleViewModel {
  ArticleViewModel.init(
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
      tableName: "articles_views", // Table name in DB
      timestamps: true,                // Enable created_at/updated_at
      paranoid: true,                  // Enable soft deletes (deleted_at)
      sequelize,                       // Sequelize instance
    },
  );

  return ArticleViewModel;
}