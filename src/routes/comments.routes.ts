/**
 * Route definition for comment-related endpoints.
 * Uses CommentController for business logic and applies authentication and validation middleware.
 */
// Import the CommentController to handle comment-related requests
import { CommentController } from "@/controllers/comment.controller";
// Import DTOs for creating and updating comments
import { CreateCommentDto, UpdateCommentDto } from "@/dtos/comments.dto";
// Import the Routes interface for route structure
import { Routes } from "@/interfaces/routes.interface";
// Import authentication middleware to protect routes
import { AuthMiddleware } from "@/middlewares/auth.middleware";
// Import validation middleware to validate request bodies
import { ValidationMiddleware } from "@/middlewares/validation.middleware";
// Import Express Router for route definitions
import { Router } from "express";

/**
 * Route definition class for comment-related endpoints.
 * Implements the Routes interface to provide path, router, and controller.
 */
export class CommentRoute implements Routes {
    /**
     * The base path for comment routes.
     * @type {string}
     */
    public path = "comments";
    /**
     * Express router instance for comment routes.
     * @type {Router}
     */
    public router = Router();
    /**
     * Controller instance to handle comment logic.
     * @type {CommentController}
     */
    public controller = new CommentController();

    /**
     * Initializes the comment route and sets up endpoints.
     */
    constructor() {
        this.initializeRoutes();
    }

    /**
     * Defines all comment-related endpoints and their middlewares.
     *
     * - GET /v1/comments: Get all comments
     * - GET /v1/comments/:article_id: Get comments for a specific article
     * - POST /v1/comments/:article_id: Create a new comment (auth, validation)
     * - PUT /v1/comments/:comment_id: Update a comment (auth, validation)
     * - DELETE /v1/comments/:comment_id: Delete a comment (auth)
     * - POST /v1/comments/:comment_id/like: Like a comment (auth)
     */
    private initializeRoutes() {
        // Get all comments
        this.router.get(`/v1/${this.path}`, this.controller.getComments);
        // Get comments by article ID
        this.router.get(`/v1/${this.path}/:article_id`, this.controller.getCommentsByArticle);
        // Create a new comment (requires authentication and validation)
        this.router.post(`/v1/${this.path}/:article_id`, AuthMiddleware, ValidationMiddleware(CreateCommentDto), this.controller.createComment);
        // Update a comment (requires authentication and validation)
        this.router.put(`/v1/${this.path}/:comment_id`, AuthMiddleware, ValidationMiddleware(UpdateCommentDto), this.controller.updateComment);
        // Delete a comment (requires authentication)
        this.router.delete(`/v1/${this.path}/:comment_id`, AuthMiddleware, this.controller.deleteComment);
        // Like a comment (requires authentication)
        this.router.post(`/v1/${this.path}/:comment_id/like`, AuthMiddleware, this.controller.likeComment);
    }

}