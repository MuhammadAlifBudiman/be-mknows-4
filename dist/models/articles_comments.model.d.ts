import { Sequelize, Model, Optional } from "sequelize";
import { Comment } from "../interfaces/comment.interface";
import { User } from "../interfaces/user.interface";
import { Article } from "../interfaces/article.interface";
export type ArticleCommentCreationAttributes = Optional<Comment, "pk" | "uuid">;
export declare class ArticleCommentModel extends Model<Comment, ArticleCommentCreationAttributes> implements Comment {
    pk: number;
    uuid: string;
    article_id: number;
    author_id: number;
    comment: string;
    readonly article: Article;
    readonly author: User;
    replies: number;
    likes: number;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default function (sequelize: Sequelize): typeof ArticleCommentModel;
