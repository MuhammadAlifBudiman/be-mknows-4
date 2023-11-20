import { CommentReplyLike } from "@/interfaces/comment.interface";
import { DataTypes, Model } from "sequelize";


export type ArticleReplyCreationAttributes = CommentReplyLike

export class CommentReplyLikeModel extends Model<CommentReplyLike, ArticleReplyCreationAttributes> implements CommentReplyLike {
    public reply_id: number;
    public user_id: number;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;
    public readonly deleted_at: Date;
}

export default function (sequelize: any): typeof CommentReplyLikeModel {
    CommentReplyLikeModel.init(
        {
            reply_id: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            user_id: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
        },
        {
            tableName: "articles_replies_likes",
            timestamps: true,
            paranoid: true,
            sequelize,
        },
    );

    return CommentReplyLikeModel;
}