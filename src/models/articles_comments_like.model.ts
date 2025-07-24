/**
 * Sequelize model definition for comment likes on articles.
 * Represents the relationship between users and comments they have liked.
 */
import { CommentLike } from "@/interfaces/comment.interface";
import { DataTypes, Model } from "sequelize";

/**
 * Type for comment like creation attributes.
 */
export type ArticleCommentLikeCreationAttributes = CommentLike;

/**
 * ArticleCommentLikeModel class for Sequelize ORM.
 * Implements CommentLike interface and adds timestamp fields.
 */
export class ArticleCommentLikeModel extends Model<CommentLike, ArticleCommentLikeCreationAttributes> implements CommentLike {
    public comment_id: number; // ID of the liked comment
    public user_id: number;    // ID of the user who liked the comment

    public readonly created_at!: Date; // Timestamp for creation
    public readonly updated_at!: Date; // Timestamp for last update
    public readonly deleted_at: Date;  // Timestamp for deletion (paranoid)
}

/**
 * Initializes the ArticleCommentLikeModel with Sequelize instance.
 * @param sequelize - Sequelize connection instance
 * @returns ArticleCommentLikeModel class
 */
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
            tableName: "articles_comments_likes", // Table name in DB
            timestamps: true,                // Enable created_at/updated_at
            paranoid: true,                  // Enable soft deletes (deleted_at)
            sequelize,                       // Sequelize instance
        },
    );

    return ArticleCommentLikeModel;
}