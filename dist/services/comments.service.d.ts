import { CreateCommentDto, UpdateCommentDto } from "../dtos/comments.dto";
import { CommentParsed } from "../interfaces/comment.interface";
export declare class CommentService {
    private commentParsed;
    getComments(): Promise<{
        comments: CommentParsed[];
    }>;
    getCommentsByArticle(article_id: string): Promise<{
        comments: CommentParsed[];
    }>;
    getCommentById(comment_id: string): Promise<CommentParsed>;
    createComment(article_id: string, author_id: number, data: CreateCommentDto): Promise<CommentParsed>;
    updateComment(comment_id: string, data: UpdateCommentDto): Promise<CommentParsed>;
    deleteComment(comment_id: string): Promise<boolean>;
    likeComment(comment_id: string, user_id: number): Promise<object>;
}
