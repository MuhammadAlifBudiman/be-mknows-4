// src/models/article-comments.model.ts
import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { Comment } from "@/interfaces/comment.interface";
import { UserModel } from "./users.model";
import { FileModel } from "./files.model";
import { User } from "@/interfaces/user.interface";

export type ArticleCommentCreationAttributes = Optional<Comment, "pk" | "uuid">;

export class ArticleCommentModel extends Model<Comment, ArticleCommentCreationAttributes> implements Comment {
  public pk: number;
  public uuid: string;
  public article_id: number;
  public author_id: number;
  public comment: string;

  public replies: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at: Date;
}

export default function (sequelize: Sequelize): typeof ArticleCommentModel {
  ArticleCommentModel.init(
    {
      pk: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      article_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      author_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "articles_comments",
      timestamps: true,
      paranoid: true,
      sequelize,
    },
  );

  return ArticleCommentModel;
}
