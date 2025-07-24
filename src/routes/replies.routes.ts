// Import the Routes interface for route structure
import { Routes } from "@/interfaces/routes.interface";
// Import authentication middleware to protect reply routes
import { AuthMiddleware } from "@/middlewares/auth.middleware";
// Import validation middleware to validate request bodies
import { ValidationMiddleware } from "@/middlewares/validation.middleware";
// Import Express Router for route definitions
import { Router } from "express";
// Import the ReplyController to handle reply-related logic
import { ReplyController } from "@/controllers/reply.controller";
// Import DTOs for creating and updating replies
import { CreateReplyDto, UpdateReplyDto } from "@/dtos/replies.dto";

/**
 * Route definition class for reply-related endpoints.
 * Implements the Routes interface to provide path, router, and controller.
 */
export class ReplyRoute implements Routes {
    /**
     * The base path for reply routes.
     * @type {string}
     */
    public path = "replies";
    /**
     * Express router instance for reply routes.
     * @type {Router}
     */
    public router = Router();
    /**
     * Controller instance to handle reply logic.
     * @type {ReplyController}
     */
    public controller = new ReplyController();

    /**
     * Initializes the reply route and sets up endpoints.
     */
    constructor() {
        this.initializeRoutes();
    }

    /**
     * Defines all reply-related endpoints and their middlewares.
     *
     * - GET /v1/replies: Get all replies
     * - GET /v1/replies/:comment_id: Get replies for a specific comment
     * - POST /v1/replies/:comment_id: Create a new reply (auth, validation)
     * - PUT /v1/replies/:reply_id: Update a reply (auth, validation)
     * - DELETE /v1/replies/:reply_id: Delete a reply (auth)
     * - POST /v1/replies/:reply_id/like: Like a reply (auth)
     */
    private initializeRoutes() {
        // Get all replies
        this.router.get(`/v1/${this.path}`, this.controller.getReplies);
        // Get replies by comment ID
        this.router.get(`/v1/${this.path}/:comment_id`, this.controller.getRepliesByComment);
        // Create a new reply (requires authentication and validation)
        this.router.post(`/v1/${this.path}/:comment_id`, AuthMiddleware, ValidationMiddleware(CreateReplyDto), this.controller.createReply);
        // Update a reply (requires authentication and validation)
        this.router.put(`/v1/${this.path}/:reply_id`, AuthMiddleware, ValidationMiddleware(UpdateReplyDto), this.controller.updateReply);
        // Delete a reply (requires authentication)
        this.router.delete(`/v1/${this.path}/:reply_id`, AuthMiddleware, this.controller.deleteReply);
        // Like a reply (requires authentication)
        this.router.post(`/v1/${this.path}/:reply_id/like`, AuthMiddleware, this.controller.likeReply);
    }

}