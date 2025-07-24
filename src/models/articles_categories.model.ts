/**
 * Sequelize model definition for the relationship between articles and categories.
 * Sets up many-to-many associations and model fields for article-category mapping.
 */
import { Sequelize, DataTypes, Model } from "sequelize";

import { ArticleModel } from "@models/articles.model";
import { CategoryModel } from "@models/categories.model";

import { ArticleCategory } from "@interfaces/article.interface";

/**
 * Type for article-category creation attributes.
 */
export type ArticleCategoryCreationAttributes = ArticleCategory;

/**
 * ArticleCategoryModel class for Sequelize ORM.
 * Implements ArticleCategory interface and adds timestamp fields.
 */
export class ArticleCategoryModel extends Model<ArticleCategory, ArticleCategoryCreationAttributes> implements ArticleCategory {
  public article_id: number; // ID of the article
  public category_id: number; // ID of the category

  public readonly created_at!: Date; // Timestamp for creation
  public readonly updated_at!: Date; // Timestamp for last update
  public readonly deleted_at: Date;  // Timestamp for deletion (paranoid)
}

/**
 * Initializes the ArticleCategoryModel with Sequelize instance and sets up associations.
 * @param sequelize - Sequelize connection instance
 * @returns ArticleCategoryModel class
 */
export default function (sequelize: Sequelize): typeof ArticleCategoryModel {
  ArticleCategoryModel.init(
    {
      article_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      category_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "articles_categories", // Table name in DB
      timestamps: true,                // Enable created_at/updated_at
      paranoid: true,                  // Enable soft deletes (deleted_at)
      sequelize,                       // Sequelize instance
    },
  );

  // Set up many-to-many and one-to-many associations
  ArticleModel.belongsToMany(CategoryModel, { through: ArticleCategoryModel, foreignKey: "article_id" });
  CategoryModel.belongsToMany(ArticleModel, { through: ArticleCategoryModel, foreignKey: "category_id" });

  ArticleModel.hasMany(ArticleCategoryModel, { foreignKey: "article_id", as: "categories" });
  ArticleCategoryModel.belongsTo(ArticleModel, { foreignKey: "article_id", as: "article" });

  CategoryModel.hasMany(ArticleCategoryModel, { foreignKey: "category_id", as: "category" });
  ArticleCategoryModel.belongsTo(CategoryModel, { foreignKey: "category_id", as: "category" });

  return ArticleCategoryModel;
}