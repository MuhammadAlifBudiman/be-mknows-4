import { getDB } from "@/database/db-lazy";
import { CreateReplyDto, UpdateReplyDto } from "@/dtos/replies.dto";
import { HttpException } from "@exceptions/HttpException";
import { CommentReply, CommentReplyParsed } from "@/interfaces/comment.interface";
import { Service } from "typedi";
import { CommentReplyModel } from "@/models/articles_replies.model";


@Service()
export class ReplyService {
  private replyParsed(reply: CommentReplyModel): CommentReplyParsed {
    return {
      uuid: reply.uuid,
      reply: reply.reply,
      comment: {
        uuid: reply.comment.uuid,
        comment: reply.comment.comment,
      },
      author: {
        uuid: reply.author.uuid,
        full_name: reply.author.full_name || null,
        avatar: reply.author.avatar?.uuid || null, 
      },
      likes: reply.likes || 0,
      };
    }

  public async getReplies(): Promise<{ replies: CommentReplyParsed[] }> {
    const DB = await getDB();
    const reply = await DB.CommentsReplies.findAll({});

    const likeCountPromises = reply.map(reply => {
      return DB.CommentsRepliesLikes.count({
        where: { reply_id: reply.pk }
      });
    });

    const likesCount = await Promise.all(likeCountPromises);

    reply.forEach((reply, index) => {
      reply.likes = likesCount[index];
    });

    const transformedReplies = reply.map(reply => this.replyParsed(reply));
    return { replies: transformedReplies };
  }

  public async getRepliesByComment(comment_id: string): Promise<{ replies: CommentReplyParsed[] }> {
    const DB = await getDB();
    const comment = await DB.ArticlesComments.findOne({ where: { uuid: comment_id }, attributes: ["pk"] });
    if(!comment) {
      throw new HttpException(false, 404, "Comment is not found");
    }
    const replies = await DB.CommentsReplies.findAll({ where: { comment_id: comment.pk } });
    if(!replies) {
      throw new HttpException(false, 404, "Reply is not found");
    }
    const likeCountPromises = replies.map(reply => {
      return DB.CommentsRepliesLikes.count({
        where: { reply_id: reply.pk }
      });
    });

    const likesCount = await Promise.all(likeCountPromises);

    replies.forEach((reply, index) => {
      reply.likes = likesCount[index];
    });

    const transformedReplies = replies.map(reply => this.replyParsed(reply));
    return { replies: transformedReplies };
  }

  public async getReplyById(reply_id: string): Promise<CommentReplyParsed> {
    const DB = await getDB();
    const reply = await DB.CommentsReplies.findOne({ where: { uuid: reply_id } });
    if (!reply) {
      throw new HttpException(false, 400, "Reply is not found");
    }

    const likeCount = await DB.CommentsRepliesLikes.count({
      where: { reply_id: reply.pk }
    });

    reply.likes = likeCount;

    const response = this.replyParsed(reply);
    return response;
  }

  public async createReply(comment_id: string, author_id: number, data: CreateReplyDto): Promise<CommentReplyParsed> {
    const DB = await getDB();
    const comment = await DB.ArticlesComments.findOne({ where: { uuid: comment_id }, attributes: ["pk"] });
    const reply = await DB.CommentsReplies.create({ comment_id: comment.pk, author_id, ...data });
    delete reply.dataValues.pk;

    return this.getReplyById(reply.uuid);
  }

  public async updateReply(reply_id: string, data: UpdateReplyDto): Promise<CommentReplyParsed> {
    const DB = await getDB();
    const updatedData: any = {};
    
    if (data.reply) updatedData.reply = data.reply;

    if (Object.keys(updatedData).length === 0) {
      throw new HttpException(false, 400, "Some field is required");
    }

    if (Object.keys(updatedData).length > 0) {
      await DB.CommentsReplies.update(updatedData, {
        where: { uuid: reply_id },
        returning: true,
      });
    }
    

    return this.getReplyById(reply_id);
  }

  public async deleteReply(reply_id: string): Promise<boolean> {
    const DB = await getDB();
    const reply = await DB.CommentsReplies.findOne({ where: { uuid: reply_id }});

    if(!reply) {
        throw new HttpException(false, 400, "Reply is not found");
    }

    const transaction = await DB.sequelize.transaction();
    try {
      await reply.destroy({ transaction });

      await Promise.all([
        DB.CommentsRepliesLikes.destroy({ where: { reply_id: reply.pk }, transaction }),
      ]);
      
      await transaction.commit();

      return true;
    } catch (error) {
      await transaction.rollback();
      throw error; 
    }
  }

  public async likeReply(reply_id: string, user_id: number): Promise<object> {
    const DB = await getDB();
    const reply = await DB.CommentsReplies.findOne({ where: { uuid: reply_id }});

    if(!reply) {
      throw new HttpException(false, 400, "Reply is not found");
    }

    const transaction = await DB.sequelize.transaction();
    try {
      const [replyLike, replyLikeCount] = await Promise.all([
        DB.CommentsRepliesLikes.findOne({ where: { reply_id: reply.pk, user_id }, transaction }),
        DB.CommentsRepliesLikes.count({ where: { reply_id: reply.pk, user_id }, transaction })
      ]);

      if (!replyLike) {
        await DB.CommentsRepliesLikes.create({ reply_id: reply.pk, user_id }, { transaction });
        await transaction.commit();
        return { reply_id, is_liked: true, likes: replyLikeCount + 1 }; 
      } else {
        await DB.CommentsRepliesLikes.destroy({ where: { reply_id: reply.pk, user_id }, force: true, transaction });
        await transaction.commit();
        return { reply_id, is_liked: false, likes: replyLikeCount - 1 }; 
      }
    }catch(error) {
      await transaction.rollback();
      throw error;
    }
  }
}