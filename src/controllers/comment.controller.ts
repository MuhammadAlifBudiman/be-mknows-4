import { Response, NextFunction } from "express";
import { RequestWithUser } from "@/interfaces/authentication/token.interface";
import { CommentService } from "@/services/comments.service";
import { apiResponse } from "@/utils/apiResponse";
import {Container} from "typedi";
import asyncHandler from "express-async-handler";
import { Comment, CommentParsed } from "@/interfaces/comment.interface";


export class CommentController{
    private comment = Container.get(CommentService);

    public getComments = asyncHandler( async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const response = await this.comment.getComments();
        res.status(200).json(apiResponse(200, "OK", "Get Comment Success", response.comments));
    });

    public getCommentsByArticle = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { article_id } = req.params;
        const response = await this.comment.getCommentsByArticle(article_id);
        res.status(200).json(apiResponse(200, "OK", "Get Comment Success", response.comments));
    });

    public createComment = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { article_id } = req.params;
        const author_id = req.user.pk;
        const data = req.body;
        const response = await this.comment.createComment(article_id, author_id, data);
        res.status(200).json(apiResponse(200, "OK", "Create Comment Success", response));
    });

    public updateComment = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { comment_id } = req.params;
        
        const data = req.body;
        const response = await this.comment.updateComment(comment_id, data);
        res.status(200).json(apiResponse(200, "OK", "Update Comment Success", response));
    });

    public deleteComment = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { comment_id } = req.params;
        const response: boolean = await this.comment.deleteComment(comment_id);
        res.status(200).json(apiResponse(200, "OK", "Delete Comment Success", response));
    });

    public likeComment = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { comment_id } = req.params;
        const user_id = req.user.pk;
        const response = await this.comment.likeComment(comment_id, user_id);
        res.status(200).json(apiResponse(200, "OK", "Like Comment Success", response));
    });
}