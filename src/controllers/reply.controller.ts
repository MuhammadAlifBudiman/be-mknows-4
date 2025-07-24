/**
 * ReplyController handles CRUD operations and interactions for comment replies.
 * Uses ReplyService for business logic and apiResponse for standardized responses.
 */
import { Response, NextFunction } from "express"; // Express types for request handling
import { RequestWithUser } from "@/interfaces/authentication/token.interface"; // Authenticated request interface
import { apiResponse } from "@/utils/apiResponse"; // Standardized API response
import {Container} from "typedi"; // Dependency injection container
import { CommentReply } from "@/interfaces/comment.interface"; // Comment reply interface
import { ReplyService } from "@/services/replies.service"; // Service for reply logic
import asyncHandler from "express-async-handler"; // Async error handler middleware

/**
 * Main controller class for reply endpoints
 */
export class ReplyController{
    /**
     * ReplyService instance for reply operations
     */
    private reply = Container.get(ReplyService);

    /**
     * Get all replies
     * @param req - Express request
     * @param res - Express response
     * @param next - Express next middleware
     */
    public getReplies = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const response = await this.reply.getReplies();
        res.status(200).json(apiResponse(200, "OK", "Get Reply Success", response.replies));
    })

    /**
     * Get replies for a specific comment
     * @param req - Express request containing comment ID
     * @param res - Express response
     * @param next - Express next middleware
     */
    public getRepliesByComment = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { comment_id } = req.params;
        const response = await this.reply.getRepliesByComment(comment_id);
        res.status(200).json(apiResponse(200, "OK", "Get Reply Success", response.replies));
    })

    /**
     * Create a new reply for a comment
     * @param req - Express request containing comment ID and reply data
     * @param res - Express response
     * @param next - Express next middleware
     */
    public createReply = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { comment_id } = req.params;
        const author_id = req.user.pk;
        const data = req.body;
        const response = await this.reply.createReply(comment_id, author_id, data);
        res.status(201).json(apiResponse(200, "OK", "Create Reply Success", response));
    })

    /**
     * Update an existing reply by ID
     * @param req - Express request containing reply ID and update data
     * @param res - Express response
     * @param next - Express next middleware
     */
    public updateReply = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { reply_id } = req.params;
        const data = req.body;
        const response = await this.reply.updateReply(reply_id, data);
        res.status(200).json(apiResponse(200, "OK", "Update Reply Success", response));
    })

    /**
     * Delete a reply by ID
     * @param req - Express request containing reply ID
     * @param res - Express response
     * @param next - Express next middleware
     */
    public deleteReply = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { reply_id } = req.params;
        const response: boolean = await this.reply.deleteReply(reply_id);
        res.status(200).json(apiResponse(200, "OK", "Delete Reply Success", {}));
    })

    /**
     * Like a reply by ID for the authenticated user
     * @param req - Express request containing reply ID and user ID
     * @param res - Express response
     * @param next - Express next middleware
     */
    public likeReply = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { reply_id } = req.params;
        const user_id = req.user.pk;
        const response = await this.reply.likeReply(reply_id, user_id);
        res.status(200).json(apiResponse(200, "OK", "Like Reply Success", response));
    })
}