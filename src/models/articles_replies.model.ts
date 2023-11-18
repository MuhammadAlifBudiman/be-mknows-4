import { CommentReply } from "@/interfaces/comment.interface";
import { DataTypes, Model, Optional } from "sequelize";


export type ArticleReplyCreationAttributes = Optional<CommentReply, "pk" | "uuid">;

export class CommentReplyModel extends Model<CommentReply, ArticleReplyCreationAttributes> implements CommentReply {
  public pk: number;
  public uuid: string;
  public comment_id: number;
  public author_id: number;
  public reply: string;

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
    },
  );

  return CommentReplyModel;
}