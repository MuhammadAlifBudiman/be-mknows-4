import { Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { Container } from "typedi";

import { Article, ArticleParsed, ArticlePopularQueryParams, ArticleQueryParams } from "@interfaces/article.interface";
import { RequestWithUser } from "@interfaces/authentication/token.interface";
import { ArticleService } from "@services/articles.service";

import { CreateArticleDto, UpdateArticleDto } from "@dtos/articles.dto";
import { apiResponse } from "@utils/apiResponse";

export class ArticleController {
  private article = Container.get(ArticleService);

  public getArticles = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const query: ArticleQueryParams = req.query;
    const response = await this.article.getArticles(query);
    res.status(200).json(apiResponse(200, "OK", "Get Articles Success", response.articles, response.pagination));
  });

  public getArticlesByCategory = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { category_id } = req.params;
    const query: ArticleQueryParams = req.query;
    const response = await this.article.getArticlesByCategory(query, category_id);
    res.status(200).json(apiResponse(200, "OK", "Get Articles Success", response.articles));
  });

  public getArticle = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { article_id } = req.params;
    const user_id = req.user.pk as number;
    this.article.addView(article_id, user_id);
    const response: ArticleParsed = await this.article.getArticleById(article_id);
    res.status(200).json(apiResponse(200, "OK", "Get Article Success", response));
  });

  public createArticle = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user_id = req.user.pk as number;
    const data: CreateArticleDto = req.body;

    const response: ArticleParsed = await this.article.createArticle(user_id, data);
    res.status(201).json(apiResponse(201, "OK", "Create Article Success", response));
  });

  /**
   * Update an article by ID for the authenticated user
   * @param req - Express request with article ID, user ID, and update data
   * @param res - Express response
   * @param next - Express next middleware
   */
  public updateArticle = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { article_id } = req.params;
    const user_id = req.user.pk as number;
    const data: UpdateArticleDto = req.body;

    const response: ArticleParsed = await this.article.updateArticle(article_id, user_id, data); // Update article
    res.status(200).json(apiResponse(200, "OK", "Update Article Success", response)); // Respond with updated article
  });

  /**
   * Delete an article by ID for the authenticated user
   * @param req - Express request with article ID and user ID
   * @param res - Express response
   * @param next - Express next middleware
   */
  public deleteArticle = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { article_id } = req.params;
    const user_id = req.user.pk as number;

    await this.article.deleteArticle(article_id, user_id); // Delete article
    res.status(200).json(apiResponse(200, "OK", "Delete Article Success", {})); // Respond with success
  });

  /**
   * Like an article by ID for the authenticated user
   * @param req - Express request with article ID and user ID
   * @param res - Express response
   * @param next - Express next middleware
   */
  public likeArticle = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { article_id } = req.params;
    const user_id = req.user.pk as number;

    const response = await this.article.likeArticle(user_id, article_id); // Like article
    res.status(200).json(apiResponse(200, "OK", "Like Article Success", response)); // Respond with like result
  });

  /**
   * Bookmark an article by ID for the authenticated user
   * @param req - Express request with article ID and user ID
   * @param res - Express response
   * @param next - Express next middleware
   */
  public bookmarkArticle = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { article_id } = req.params;
    const user_id = req.user.pk as number;

    const response = await this.article.bookmarkArticle(user_id, article_id); // Bookmark article
    res.status(200).json(apiResponse(200, "OK", "Bookmark Article Success", response)); // Respond with bookmark result
  });

  /**
   * Get all articles bookmarked by the authenticated user
   * @param req - Express request with user ID
   * @param res - Express response
   * @param next - Express next middleware
   */
  public getBookmarkByMe = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user_id = req.user.pk as number;

    const response = await this.article.getBookmarkByMe(user_id); // Get user's bookmarks
    res.status(200).json(apiResponse(200, "OK", "Get Bookmark Success", response.articles));
  });

  public getPopularArticles = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const query: ArticlePopularQueryParams = req.query;
    const response = await this.article.getPopularArticles(query);
    res.status(200).json(apiResponse(200, "OK", "Get Popular Articles Success", response.articles ));
  });
}