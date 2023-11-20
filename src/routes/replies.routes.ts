import { Routes } from "@/interfaces/routes.interface";
import { AuthMiddleware } from "@/middlewares/auth.middleware";
import { ValidationMiddleware } from "@/middlewares/validation.middleware";
import { Router } from "express";
import { ReplyController } from "@/controllers/reply.controller";
import { CreateReplyDto, UpdateReplyDto } from "@/dtos/replies.dto";

export class ReplyRoute implements Routes {
    public path = "replies";
    public router = Router();
    public controller = new ReplyController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`/v1/${this.path}`, this.controller.getReplies);
        this.router.get(`/v1/${this.path}/:comment_id`, this.controller.getRepliesByComment);
        this.router.post(`/v1/${this.path}/:comment_id`, AuthMiddleware, ValidationMiddleware(CreateReplyDto), this.controller.createReply);
        this.router.put(`/v1/${this.path}/:reply_id`, AuthMiddleware, ValidationMiddleware(UpdateReplyDto), this.controller.updateReply);
        this.router.delete(`/v1/${this.path}/:reply_id`, AuthMiddleware, this.controller.deleteReply);
        this.router.post(`/v1/${this.path}/:reply_id/like`, AuthMiddleware, this.controller.likeReply);
    }

}