import { CommentController } from "@/controllers/comment.controller";
import { CreateCommentDto, UpdateCommentDto } from "@/dtos/comments.dto";
import { Routes } from "@/interfaces/routes.interface";
import { AuthMiddleware } from "@/middlewares/auth.middleware";
import { ValidationMiddleware } from "@/middlewares/validation.middleware";
import { Router } from "express";


export class CommentRoute implements Routes {
    public path = "comments";
    public router = Router();
    public controller = new CommentController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`/v1/${this.path}`, this.controller.getComments);
        this.router.get(`/v1/${this.path}/:article_id`, this.controller.getCommentsByArticle);
        this.router.post(`/v1/${this.path}/:article_id`, AuthMiddleware, ValidationMiddleware(CreateCommentDto), this.controller.createComment);
        this.router.put(`/v1/${this.path}/:comment_id`, AuthMiddleware, ValidationMiddleware(UpdateCommentDto), this.controller.updateComment);
        this.router.delete(`/v1/${this.path}/:comment_id`, AuthMiddleware, this.controller.deleteComment);
        this.router.post(`/v1/${this.path}/:comment_id/like`, AuthMiddleware, this.controller.likeComment);
    }

}