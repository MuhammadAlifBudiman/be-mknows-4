import { CommentLike } from "@/interfaces/comment.interface";
import { DataTypes, Model } from "sequelize";


export type ArticleCommentLikeCreationAttributes = CommentLike;

export class ArticleCommentLikeModel extends Model<CommentLike, ArticleCommentLikeCreationAttributes> implements CommentLike {
    public comment_id: number;
    public user_id: number;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;
    public readonly deleted_at: Date;
}

export default function (sequelize: any): typeof ArticleCommentLikeModel {
    ArticleCommentLikeModel.init(
        {
            comment_id: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            user_id: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
        },
        {
            tableName: "articles_comments_likes",
            timestamps: true,
            paranoid: true,
            sequelize,
        },
    );

    return ArticleCommentLikeModel;
}