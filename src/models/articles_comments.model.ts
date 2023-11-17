// src/models/article-comments.model.ts
import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { ArticleComment } from "@/interfaces/article.interface";

export type ArticleCommentCreationAttributes = Optional<ArticleComment, "pk" | "uuid">;

export class ArticleCommentModel extends Model<ArticleComment, ArticleCommentCreationAttributes> implements ArticleComment {
  public pk: number;
  public uuid: string;
  public article_id: number;
  public author_id: number;
  public comment: string;


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
