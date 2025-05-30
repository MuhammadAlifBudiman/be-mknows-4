import { Sequelize, Model } from "sequelize";
import { ArticleCategory } from "../interfaces/article.interface";
export type ArticleCategoryCreationAttributes = ArticleCategory;
export declare class ArticleCategoryModel extends Model<ArticleCategory, ArticleCategoryCreationAttributes> implements ArticleCategory {
    article_id: number;
    category_id: number;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default function (sequelize: Sequelize): typeof ArticleCategoryModel;
