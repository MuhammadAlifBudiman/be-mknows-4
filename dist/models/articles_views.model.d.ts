import { Sequelize, Model } from "sequelize";
import { ArticleView } from "../interfaces/article.interface";
export type ArticleViewCreationAttributes = ArticleView;
export declare class ArticleViewModel extends Model<ArticleView, ArticleViewCreationAttributes> implements ArticleView {
    article_id: number;
    user_id: number;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default function (sequelize: Sequelize): typeof ArticleViewModel;
