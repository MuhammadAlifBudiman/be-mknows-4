import { Sequelize, Model } from "sequelize";
import { ArticleLike } from "../interfaces/article.interface";
export type ArticleLikeCreationAttributes = ArticleLike;
export declare class ArticleLikeModel extends Model<ArticleLike, ArticleLikeCreationAttributes> implements ArticleLike {
    article_id: number;
    user_id: number;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default function (sequelize: Sequelize): typeof ArticleLikeModel;
