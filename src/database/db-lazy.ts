/**
 * Lazy database initialization and model registration for Sequelize ORM.
 * Ensures a single database connection and model setup per application lifecycle.
 */
import { Sequelize } from "sequelize"; // Sequelize ORM library
import { NODE_ENV } from "@config/index"; // Current environment
import { logger } from "@utils/logger"; // Logger utility
import config from "@config/database"; // Database configuration
// Import all Sequelize models
import OTPModel from "@/models/otps.model";
import RoleModel from "@models/roles.model";
import FileModel from "@models/files.model";
import UserModel from "@models/users.model";
import UserRoleModel from "@models/users_roles.model";
import UserSessionModel from "@models/users_sessions.model";
import CategoryModel from "@models/categories.model";
import ArticleModel from "@models/articles.model";
import ArticleCategoryModel from "@models/articles_categories.model";
import ArticleLikeModel from "@models/articles_likes.model";
import ArticleCommentModel from "@/models/articles_comments.model";
import CommentReplyModel from "@/models/articles_replies.model";
import ArticleCommentLikeModel from "@/models/articles_comments_like.model";
import CommentReplyLikeModel from "@/models/articles_replies_like.model";
import ArticleBookmarkModel from "@/models/articles_bookmark.model";
import ArticleViewModel from "@/models/articles_views.model";

// Singleton database instance and state flags
let DB: any = null;
let initializing = false;
let initialized = false;

/**
 * Returns the initialized database object with all models.
 * Ensures only one connection and initialization (lazy loading).
 * @returns {Promise<any>} Database object with models and Sequelize instance
 */
export async function getDB() {
  // Return DB if already initialized
  if (initialized) return DB;
  // Wait if initialization is in progress
  if (initializing) {
    while (!initialized) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    return DB;
  }
  initializing = true;

  // Get config for current environment
  const dbConfig = config[NODE_ENV] || config["development"];
  // Create Sequelize instance
  const sequelize = new Sequelize(
    dbConfig.database as string,
    dbConfig.username as string,
    dbConfig.password,
    dbConfig
  );
  // Authenticate connection
  await sequelize.authenticate();
  logger.info(`=> Database Connected on ${NODE_ENV}`);

  // Register all models with Sequelize instance
  DB = {
    OTPs: OTPModel(sequelize),
    Files: FileModel(sequelize),
    Roles: RoleModel(sequelize),
    Users: UserModel(sequelize),
    UsersRoles: UserRoleModel(sequelize),
    UsersSessions: UserSessionModel(sequelize),
    Categories: CategoryModel(sequelize),
    Articles: ArticleModel(sequelize),
    ArticlesCategories: ArticleCategoryModel(sequelize),
    ArticlesLikes: ArticleLikeModel(sequelize),
    ArticlesComments: ArticleCommentModel(sequelize),
    CommentsReplies: CommentReplyModel(sequelize),
    ArticleCommentsLikes: ArticleCommentLikeModel(sequelize),
    CommentsRepliesLikes: CommentReplyLikeModel(sequelize),
    ArticlesBookmarks: ArticleBookmarkModel(sequelize),
    ArticlesViews: ArticleViewModel(sequelize),
    sequelize, // Sequelize connection instance (for raw queries)
    Sequelize, // Sequelize library
  };
  initialized = true;
  return DB;
}
