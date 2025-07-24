/**
 * Route definition for article-related endpoints.
 * Uses ArticleController for business logic and applies authentication and validation middleware.
 */
import { Router } from "express"; // Express router
import { Routes } from "@interfaces/routes.interface"; // Route interface

import { ArticleController } from "@controllers/article.controller"; // Controller for article operations
import { AuthMiddleware } from "@middlewares/auth.middleware"; // Middleware for authentication
import { ValidationMiddleware } from "@middlewares/validation.middleware"; // Middleware for request validation
import { CreateArticleDto, UpdateArticleDto } from "@dtos/articles.dto"; // DTOs for article validation

/**
 * ArticleRoute class implements article-related routes.
 * - path: Base path for article routes
 * - router: Express router instance
 * - article: ArticleController instance
 */
export class ArticleRoute implements Routes {
  public path = "articles";
  public router = Router();
  public article = new ArticleController();

  constructor() {
    this.initializeRoutes();
  }

  /**
   * Initializes article routes and applies middleware.
   * - GET /categories/:category_id: Get articles by category
   * - GET /: Get all articles
   * - GET /popular: Get popular articles
   * - GET /:article_id: Get article by ID (auth required)
   * - POST /:article_id/like: Like an article (auth required)
   * - POST /: Create a new article (auth & validation required)
   * - PUT /:article_id: Update an article (auth & validation required)
   * - DELETE /:article_id: Delete an article (auth required)
   * - POST /:article_id/bookmark: Bookmark an article (auth required)
   * - GET /bookmark/me: Get user's bookmarks (auth required)
   */
  private initializeRoutes() {
    this.router.get(`/v1/${this.path}/categories/:category_id`, this.article.getArticlesByCategory);
    this.router.get(`/v1/${this.path}`, this.article.getArticles);
    this.router.get(
      `/v1/${this.path}/popular`,
      this.article.getPopularArticles
    );
    this.router.get(`/v1/${this.path}/:article_id`, AuthMiddleware, this.article.getArticle);
    this.router.post(`/v1/${this.path}/:article_id/like`, AuthMiddleware, this.article.likeArticle);
    this.router.post(`/v1/${this.path}`, 
      AuthMiddleware, ValidationMiddleware(CreateArticleDto), 
      this.article.createArticle
    );
    this.router.put(
      `/v1/${this.path}/:article_id`, 
      AuthMiddleware, ValidationMiddleware(UpdateArticleDto), 
      this.article.updateArticle
    );
    this.router.delete(
      `/v1/${this.path}/:article_id`,
      AuthMiddleware,
      this.article.deleteArticle
    );
    this.router.post(
      `/v1/${this.path}/:article_id/bookmark`,
      AuthMiddleware,
      this.article.bookmarkArticle
    );
    this.router.get(
      `/v1/${this.path}/bookmark/me`,
      AuthMiddleware,
      this.article.getBookmarkByMe
    );
  }
}