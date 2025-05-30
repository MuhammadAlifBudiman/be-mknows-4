import { CommentLike } from "../interfaces/comment.interface";
import { Model } from "sequelize";
export type ArticleCommentLikeCreationAttributes = CommentLike;
export declare class ArticleCommentLikeModel extends Model<CommentLike, ArticleCommentLikeCreationAttributes> implements CommentLike {
    comment_id: number;
    user_id: number;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default function (sequelize: any): typeof ArticleCommentLikeModel;
