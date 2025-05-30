import { CommentReplyLike } from "../interfaces/comment.interface";
import { Model } from "sequelize";
export type ArticleReplyCreationAttributes = CommentReplyLike;
export declare class CommentReplyLikeModel extends Model<CommentReplyLike, ArticleReplyCreationAttributes> implements CommentReplyLike {
    reply_id: number;
    user_id: number;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default function (sequelize: any): typeof CommentReplyLikeModel;
