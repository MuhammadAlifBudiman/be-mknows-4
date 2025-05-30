import { Comment, CommentReply } from "../interfaces/comment.interface";
import { User } from "../interfaces/user.interface";
import { Model, Optional } from "sequelize";
export type ArticleReplyCreationAttributes = Optional<CommentReply, "pk" | "uuid">;
export declare class CommentReplyModel extends Model<CommentReply, ArticleReplyCreationAttributes> implements CommentReply {
    pk: number;
    uuid: string;
    comment_id: number;
    author_id: number;
    reply: string;
    readonly author: User;
    readonly comment: Comment;
    likes: number;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default function (sequelize: any): typeof CommentReplyModel;
