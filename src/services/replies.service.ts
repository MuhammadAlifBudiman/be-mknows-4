import { DB } from "@/database";
import { CreateReplyDto, UpdateReplyDto } from "@/dtos/replies.dto";
import { HttpException } from "@exceptions/HttpException";
import { CommentReply } from "@/interfaces/comment.interface";
import { Service } from "typedi";


@Service()
export class ReplyService {
  public async getReplies(): Promise<CommentReply[]> {
    return await DB.CommentsReplies.findAll({ 
        attributes: { 
          exclude: ["pk"],
        },
      });
  }

  public async getRepliesByComment(comment_id: string): Promise<CommentReply[]> {
    const comment = await DB.ArticlesComments.findOne({ where: { uuid: comment_id }, attributes: ["pk"] });
    return await DB.CommentsReplies.findAll({ 
        attributes: { 
          exclude: ["pk"],
        },
        where: { comment_id: comment.pk },
      });
  }

  public async createReply(comment_id: string, author_id: number, data: CreateReplyDto): Promise<CommentReply> {
    const comment = await DB.ArticlesComments.findOne({ where: { uuid: comment_id }, attributes: ["pk"] });
    const reply = await DB.CommentsReplies.create({ comment_id: comment.pk, author_id, ...data });
    delete reply.dataValues.pk;

    return reply;
  }

  public async updateReply(reply_id: string, data: UpdateReplyDto): Promise<CommentReply> {
    const updatedData: any = {};
    
    if (data.reply) updatedData.reply = data.reply;

    if (Object.keys(updatedData).length === 0) {
      throw new HttpException(false, 400, "Some field is required");
    }

    const [_, [reply]] = await DB.CommentsReplies.update(updatedData, {
      where: { uuid: reply_id },
      returning: true,
    });
    
    delete reply.dataValues.pk;

    return reply;
  }

  public async deleteReply(reply_id: string): Promise<boolean> {
    const reply = await DB.CommentsReplies.findOne({ where: { uuid: reply_id }});

    if(!reply) {
        throw new HttpException(false, 400, "Reply is not found");
    }

    await reply.destroy();
    return true;
  }
}