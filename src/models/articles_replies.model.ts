import { Comment, CommentReply } from "@/interfaces/comment.interface";
import { User } from "@/interfaces/user.interface";
import { DataTypes, Model, Optional } from "sequelize";
import { ArticleCommentModel } from "./articles_comments.model";
import { UserModel } from "./users.model";
import { FileModel } from "./files.model";


export type ArticleReplyCreationAttributes = Optional<CommentReply, "pk" | "uuid">;

export class CommentReplyModel extends Model<CommentReply, ArticleReplyCreationAttributes> implements CommentReply {
  public pk: number;
  public uuid: string;
  public comment_id: number;
  public author_id: number;
  public reply: string;

  public readonly author: User;
  public readonly comment: Comment;
  public likes: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at: Date;
}

export default function (sequelize: any): typeof CommentReplyModel {
  CommentReplyModel.init(
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
      comment_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      author_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      reply: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "articles_replies",
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
            attributes: ["uuid", "comment"],
            model: ArticleCommentModel,
            as: "comment"
          }
        ]
      }
    },
  );

  ArticleCommentModel.hasMany(CommentReplyModel, { foreignKey: "comment_id", as: "replies" });

  CommentReplyModel.belongsTo(ArticleCommentModel, { foreignKey: "comment_id", as: "comment" });
  CommentReplyModel.belongsTo(UserModel, { foreignKey: "author_id", as: "author" });

  return CommentReplyModel;
}