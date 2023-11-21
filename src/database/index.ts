import { Sequelize } from "sequelize";
import { NODE_ENV } from "@config/index";
import { logger } from "@utils/logger";

import config from "@config/database";
const dbConfig = config[NODE_ENV] || config["development"];

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

const sequelize = new Sequelize(
  dbConfig.database as string,
  dbConfig.username as string,
  dbConfig.password,
  dbConfig
);

sequelize
  .authenticate()
  .then(() => logger.info(`=> Database Connected on ${NODE_ENV}`))
  .catch((e) => console.error(e));

export const DB = {
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

  sequelize, // connection instance (RAW queries)
  Sequelize, // library
};