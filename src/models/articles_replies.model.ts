/**
 * Sequelize model definition for replies to article comments.
 * Represents replies made by users to comments, including associations and scopes.
 */
import { Comment, CommentReply } from "@/interfaces/comment.interface";
import { User } from "@/interfaces/user.interface";
import { DataTypes, Model, Optional } from "sequelize";
import { ArticleCommentModel } from "./articles_comments.model";
import { UserModel } from "./users.model";
import { FileModel } from "./files.model";


/**
 * Type for reply creation attributes, omitting pk and uuid for auto-generation.
 */
export type ArticleReplyCreationAttributes = Optional<CommentReply, "pk" | "uuid">;

/**
 * CommentReplyModel class for Sequelize ORM.
 * Implements CommentReply interface and adds associations and timestamp fields.
 */
export class CommentReplyModel extends Model<CommentReply, ArticleReplyCreationAttributes> implements CommentReply {
  public pk: number;              // Primary key
  public uuid: string;            // Unique identifier
  public comment_id: number;      // Associated comment ID
  public author_id: number;       // Author's user ID
  public reply: string;           // Reply text

  public readonly author: User;   // Associated author object
  public readonly comment: Comment; // Associated comment object
  public likes: number;           // Number of likes

  public readonly created_at!: Date; // Timestamp for creation
  public readonly updated_at!: Date; // Timestamp for last update
  public readonly deleted_at: Date;  // Timestamp for deletion (paranoid)
}

/**
 * Initializes the CommentReplyModel with Sequelize instance and sets up associations and scopes.
 * @param sequelize - Sequelize connection instance
 * @returns CommentReplyModel class
 */
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
      tableName: "articles_replies", // Table name in DB
      timestamps: true,                // Enable created_at/updated_at
      paranoid: true,                  // Enable soft deletes (deleted_at)
      sequelize,                       // Sequelize instance
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

  // Set up associations
  ArticleCommentModel.hasMany(CommentReplyModel, { foreignKey: "comment_id", as: "replies" });
  CommentReplyModel.belongsTo(ArticleCommentModel, { foreignKey: "comment_id", as: "comment" });
  CommentReplyModel.belongsTo(UserModel, { foreignKey: "author_id", as: "author" });

  return CommentReplyModel;
}