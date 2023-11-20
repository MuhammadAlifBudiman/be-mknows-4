import { Response, NextFunction } from "express";
import { RequestWithUser } from "@/interfaces/authentication/token.interface";
import { apiResponse } from "@/utils/apiResponse";
import {Container} from "typedi";
import { CommentReply } from "@/interfaces/comment.interface";
import { ReplyService } from "@/services/replies.service";

export class ReplyController{
    private reply = Container.get(ReplyService);

    public getReplies = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const response = await this.reply.getReplies();
        res.status(200).json(apiResponse(200, "OK", "Get Reply Success", response.replies));
    }

    public getRepliesByComment = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { comment_id } = req.params;
        const response = await this.reply.getRepliesByComment(comment_id);
        res.status(200).json(apiResponse(200, "OK", "Get Reply Success", response.replies));
    }

    public createReply = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { comment_id } = req.params;
        const author_id = req.user.pk;
        const data = req.body;
        const response = await this.reply.createReply(comment_id, author_id, data);
        res.status(200).json(apiResponse(200, "OK", "Create Reply Success", response));
    }

    public updateReply = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { reply_id } = req.params;
        
        const data = req.body;
        const response = await this.reply.updateReply(reply_id, data);
        res.status(200).json(apiResponse(200, "OK", "Update Reply Success", response));
    }

    public deleteReply = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { reply_id } = req.params;
        const response: boolean = await this.reply.deleteReply(reply_id);
        res.status(200).json(apiResponse(200, "OK", "Delete Reply Success", response));
    }

    public likeReply = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { reply_id } = req.params;
        const user_id = req.user.pk;
        const response = await this.reply.likeReply(reply_id, user_id);
        res.status(200).json(apiResponse(200, "OK", "Like Reply Success", response));
    }
}