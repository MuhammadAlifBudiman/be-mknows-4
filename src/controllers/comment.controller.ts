/**
 * CommentController handles CRUD operations for comments and comment interactions.
 * Uses CommentService for business logic and apiResponse for standardized responses.
 */
import { Response, NextFunction } from "express"; // Express types for request handling
import { RequestWithUser } from "@/interfaces/authentication/token.interface"; // Authenticated request interface
import { CommentService } from "@/services/comments.service"; // Service for comment logic
import { apiResponse } from "@/utils/apiResponse"; // Standardized API response
import {Container} from "typedi"; // Dependency injection container
import asyncHandler from "express-async-handler"; // Async error handler middleware
import { Comment, CommentParsed } from "@/interfaces/comment.interface"; // Comment interfaces

/**
 * Main controller class for comment endpoints
 */
export class CommentController{
    /**
     * CommentService instance for comment operations
     */
    private comment = Container.get(CommentService);

    /**
     * Get all comments
     * @param req - Express request
     * @param res - Express response
     * @param next - Express next middleware
     */
    public getComments = asyncHandler( async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const response = await this.comment.getComments();
        res.status(200).json(apiResponse(200, "OK", "Get Comment Success", response.comments));
    });

    /**
     * Get comments for a specific article
     * @param req - Express request containing article ID
     * @param res - Express response
     * @param next - Express next middleware
     */
    public getCommentsByArticle = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { article_id } = req.params;
        const response = await this.comment.getCommentsByArticle(article_id);
        res.status(200).json(apiResponse(200, "OK", "Get Comment Success", response.comments));
    });

    /**
     * Create a new comment for an article
     * @param req - Express request containing article ID and comment data
     * @param res - Express response
     * @param next - Express next middleware
     */
    public createComment = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { article_id } = req.params;
        const author_id = req.user.pk;
        const data = req.body;
        const response = await this.comment.createComment(article_id, author_id, data);
        res.status(201).json(apiResponse(200, "OK", "Create Comment Success", response));
    });

    /**
     * Update an existing comment by ID
     * @param req - Express request containing comment ID and update data
     * @param res - Express response
     * @param next - Express next middleware
     */
    public updateComment = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { comment_id } = req.params;
        const data = req.body;
        const response = await this.comment.updateComment(comment_id, data);
        res.status(200).json(apiResponse(200, "OK", "Update Comment Success", response));
    });

    /**
     * Delete a comment by ID
     * @param req - Express request containing comment ID
     * @param res - Express response
     * @param next - Express next middleware
     */
    public deleteComment = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { comment_id } = req.params;
        const response: boolean = await this.comment.deleteComment(comment_id);
        res.status(200).json(apiResponse(200, "OK", "Delete Comment Success", {}));
    });

    /**
     * Like a comment by ID for the authenticated user
     * @param req - Express request containing comment ID and user ID
     * @param res - Express response
     * @param next - Express next middleware
     */
    public likeComment = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { comment_id } = req.params;
        const user_id = req.user.pk;
        const response = await this.comment.likeComment(comment_id, user_id);
        res.status(200).json(apiResponse(200, "OK", "Like Comment Success", response));
    });
}