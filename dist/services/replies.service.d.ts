import { CreateReplyDto, UpdateReplyDto } from "../dtos/replies.dto";
import { CommentReplyParsed } from "../interfaces/comment.interface";
export declare class ReplyService {
    private replyParsed;
    getReplies(): Promise<{
        replies: CommentReplyParsed[];
    }>;
    getRepliesByComment(comment_id: string): Promise<{
        replies: CommentReplyParsed[];
    }>;
    getReplyById(reply_id: string): Promise<CommentReplyParsed>;
    createReply(comment_id: string, author_id: number, data: CreateReplyDto): Promise<CommentReplyParsed>;
    updateReply(reply_id: string, data: UpdateReplyDto): Promise<CommentReplyParsed>;
    deleteReply(reply_id: string): Promise<boolean>;
    likeReply(reply_id: string, user_id: number): Promise<object>;
}
