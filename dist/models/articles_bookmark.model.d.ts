import { Sequelize, Model } from "sequelize";
import { ArticleBookmark } from "../interfaces/article.interface";
export type ArticleBookmarkCreationAttributes = ArticleBookmark;
export declare class ArticleBookmarkModel extends Model<ArticleBookmark, ArticleBookmarkCreationAttributes> implements ArticleBookmark {
    article_id: number;
    user_id: number;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default function (sequelize: Sequelize): typeof ArticleBookmarkModel;
