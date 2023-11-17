import { Response, NextFunction } from "express";
import { ArticleComment } from "@/interfaces/article.interface";
import { RequestWithUser } from "@/interfaces/authentication/token.interface";
import { CommentService } from "@/services/comments.service";
import { apiResponse } from "@/utils/apiResponse";
import {Container} from "typedi";


export class CommentController{
    private comment = Container.get(CommentService);

    public getComments = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const response: ArticleComment[] = await this.comment.getComments();
        res.status(200).json(apiResponse(200, "OK", "Get Comment Success", response));
    }

    public getCommentsByArticle = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { article_id } = req.params;
        const response: ArticleComment[] = await this.comment.getCommentsByArticle(article_id);
        res.status(200).json(apiResponse(200, "OK", "Get Comment Success", response));
    }

    public createComment = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { article_id } = req.params;
        const author_id = req.user.pk;
        const data = req.body;
        const response: ArticleComment = await this.comment.createComment(article_id, author_id, data);
        res.status(200).json(apiResponse(200, "OK", "Create Comment Success", response));
    }

    public updateComment = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { comment_id } = req.params;
        
        const data = req.body;
        const response: ArticleComment = await this.comment.updateComment(comment_id, data);
        res.status(200).json(apiResponse(200, "OK", "Update Comment Success", response));
    }

    public deleteComment = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { comment_id } = req.params;
        const response: boolean = await this.comment.deleteComment(comment_id);
        res.status(200).json(apiResponse(200, "OK", "Delete Comment Success", response));
    }
}