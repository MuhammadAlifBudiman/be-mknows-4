/**
 * Sequelize model definition for likes on comment replies.
 * Represents the relationship between users and replies they have liked.
 */
import { CommentReplyLike } from "@/interfaces/comment.interface";
import { DataTypes, Model } from "sequelize";

/**
 * Type for comment reply like creation attributes.
 */
export type ArticleReplyCreationAttributes = CommentReplyLike;

/**
 * CommentReplyLikeModel class for Sequelize ORM.
 * Implements CommentReplyLike interface and adds timestamp fields.
 */
export class CommentReplyLikeModel extends Model<CommentReplyLike, ArticleReplyCreationAttributes> implements CommentReplyLike {
    public reply_id: number; // ID of the liked reply
    public user_id: number;  // ID of the user who liked the reply

    public readonly created_at!: Date; // Timestamp for creation
    public readonly updated_at!: Date; // Timestamp for last update
    public readonly deleted_at: Date;  // Timestamp for deletion (paranoid)
}

/**
 * Initializes the CommentReplyLikeModel with Sequelize instance.
 * @param sequelize - Sequelize connection instance
 * @returns CommentReplyLikeModel class
 */
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
            tableName: "articles_replies_likes", // Table name in DB
            timestamps: true,                // Enable created_at/updated_at
            paranoid: true,                  // Enable soft deletes (deleted_at)
            sequelize,                       // Sequelize instance
        },
    );

    return CommentReplyLikeModel;
}