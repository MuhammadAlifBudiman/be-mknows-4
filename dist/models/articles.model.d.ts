import { Sequelize, Model, Optional } from "sequelize";
import { User } from "../interfaces/user.interface";
import { File } from "../interfaces/file.interface";
import { Article } from "../interfaces/article.interface";
import { ArticleCategory } from "../interfaces/article.interface";
export type ArticleCreationAttributes = Optional<Article, "pk" | "uuid">;
export declare class ArticleModel extends Model<Article, ArticleCreationAttributes> implements Article {
    pk: number;
    uuid: string;
    title: string;
    description: string;
    content: string;
    thumbnail_id: number;
    author_id: number;
    readonly thumbnail: File;
    readonly author: User;
    readonly categories: ArticleCategory[];
    views: number;
    likes: number;
    comments: number;
    bookmarks: number;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
}
export default function (sequelize: Sequelize): typeof ArticleModel;
