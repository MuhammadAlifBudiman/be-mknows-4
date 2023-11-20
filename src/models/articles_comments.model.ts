// src/models/article-comments.model.ts
import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { Comment } from "@/interfaces/comment.interface";
import { UserModel } from "./users.model";
import { FileModel } from "./files.model";
import { User } from "@/interfaces/user.interface";
import { Article } from "@/interfaces/article.interface";
import { ArticleModel } from "./articles.model";

export type ArticleCommentCreationAttributes = Optional<Comment, "pk" | "uuid">;

export class ArticleCommentModel extends Model<Comment, ArticleCommentCreationAttributes> implements Comment {
  public pk: number;
  public uuid: string;
  public article_id: number;
  public author_id: number;
  public comment: string;

  public readonly article: Article
  public readonly author: User;

  public replies: number;
  public likes: number;

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
      defaultScope: {
        include: [
          {
            attributes: ["uuid", "full_name", "display_picture"],
            model: UserModel,
            as: "author",
            include: [
              {
                attributes: ["uuid"],
                model: FileModel,
                as: "avatar"
              }
            ]
          },
          {
            attributes: ["uuid", "title"],
            model: ArticleModel,
            as: "article",
          },
        ]
      }
    },
  );

  ArticleModel.hasMany(ArticleCommentModel, { foreignKey: "article_id", as: "comments" });
  ArticleCommentModel.belongsTo(ArticleModel, { foreignKey: "article_id", as: "article" });
  ArticleCommentModel.belongsTo(UserModel, { foreignKey: "author_id", as: "author" });

  return ArticleCommentModel;
}
