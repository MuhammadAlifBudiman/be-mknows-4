import { DB } from "@/database";
import { CreateCommentDto, UpdateCommentDto } from "@/dtos/comments.dto";
import { HttpException } from "@exceptions/HttpException";
import { Comment, CommentParsed } from "@/interfaces/comment.interface";
import { ArticleCommentModel } from "@/models/articles_comments.model";
import { Service } from "typedi";
import { Op } from "sequelize";


@Service()
export class CommentService {
  private commentParsed(comment: ArticleCommentModel): CommentParsed {
    return {
      uuid: comment.uuid,
      comment: comment.comment,
      article: {
        uuid: comment.article.uuid,
        title: comment.article.title
      },
      author: {
        uuid: comment.author.uuid,
        full_name: comment.author.full_name || null,
        avatar: comment.author.avatar?.uuid || null, 
      },
      likes: comment.likes || 0,
      replies: comment.replies || 0
    };
  }

  public async getComments(): Promise<{comments: CommentParsed[]}> {
    const comments = await DB.ArticlesComments.findAll({});

    const repliesCountPromises = comments.map(comment => {
      return DB.CommentsReplies.count({
        where: { comment_id: comment.pk }
      });
    });


    const repliesCount = await Promise.all(repliesCountPromises);

    comments.forEach((comment, index) => {
      comment.replies = repliesCount[index];
    });

    const likeCountPromises = comments.map(comment => {
      return DB.ArticleCommentsLikes.count({
        where: { comment_id: comment.pk }
      });
    });

    const likesCount = await Promise.all(likeCountPromises);

    comments.forEach((comment, index) => {
      comment.likes = likesCount[index];
    });

    const transformedComments = comments.map(comment => this.commentParsed(comment));

    return { comments: transformedComments };
  }

  public async getCommentsByArticle(article_id: string): Promise<{comments: CommentParsed[]}> {
    const article = await DB.Articles.findOne({ where: { uuid: article_id }, attributes: ["pk"] });
    if(!article) {
      throw new HttpException(false, 404, "Article is not found");
    }
    const comments = await DB.ArticlesComments.findAll({ where: { article_id: article.pk } });
    if(!comments) {
      throw new HttpException(false, 404, "Comment is not found");
    }
    const repliesCountPromises = comments.map(comment => {
      return DB.CommentsReplies.count({
        where: { comment_id: comment.pk }
      });
    });


    const repliesCount = await Promise.all(repliesCountPromises);

    comments.forEach((comment, index) => {
      comment.replies = repliesCount[index];
    });

    const likeCountPromises = comments.map(comment => {
      return DB.ArticleCommentsLikes.count({
        where: { comment_id: comment.pk }
      });
    });

    const likesCount = await Promise.all(likeCountPromises);

    comments.forEach((comment, index) => {
      comment.likes = likesCount[index];
    });

    const transformedComments = comments.map(comment => this.commentParsed(comment));

    return { comments: transformedComments };
  }

  public async getCommentById(comment_id: string): Promise<CommentParsed> {
    const comment = await DB.ArticlesComments.findOne({ where: { uuid: comment_id }});
    const likesCount = await DB.ArticleCommentsLikes.count({
      where: { comment_id: comment.pk }
    });
        
    comment.likes = likesCount;

    const repliesCount = await DB.CommentsReplies.count({
      where: { comment_id: comment.pk }
    });

    comment.replies = repliesCount;

    const response = this.commentParsed(comment);

    return response;
  }

  public async createComment(article_id: string, author_id: number, data: CreateCommentDto): Promise<CommentParsed> {
    const article = await DB.Articles.findOne({ where: { uuid: article_id }, attributes: ["pk"] });
    const comment = await DB.ArticlesComments.create({ article_id: article.pk, author_id, ...data });
    delete comment.dataValues.pk;

    return this.getCommentById(comment.uuid);
  }

  public async updateComment(comment_id: string, data: UpdateCommentDto): Promise<CommentParsed> {
    const comment = await DB.ArticlesComments.findOne({ where: { uuid: comment_id }});
    const updatedData: any = {};
    
    if (data.comment) updatedData.comment = data.comment;

    if (Object.keys(updatedData).length === 0) {
      throw new HttpException(false, 400, "Some field is required");
    }

    if (Object.keys(updatedData).length > 0) {
      await DB.ArticlesComments.update(updatedData, {
        where: { uuid: comment_id },
        returning: true,
      });
    }

    return this.getCommentById(comment_id);
  }

  public async deleteComment(comment_id: string): Promise<boolean> {
    const comment = await DB.ArticlesComments.findOne({ where: { uuid: comment_id }});

    if(!comment) {
      throw new HttpException(false, 400, "Comment is not found");
    }

    const replies = await DB.CommentsReplies.findAll({ attributes: ["pk"], where: { comment_id: comment.pk} });
    const replyIds = replies.map(reply => reply.pk);

    const transaction = await DB.sequelize.transaction();
    try {
      await comment.destroy({ transaction });

      await Promise.all([
        DB.ArticleCommentsLikes.destroy({ where: { comment_id: comment.pk}, transaction }),
        DB.CommentsReplies.destroy({ where: { comment_id: comment.pk }, transaction }),
        DB.CommentsRepliesLikes.destroy({ where: { reply_id: { [Op.in]: replyIds } }, transaction }),
      ]);
      
      await transaction.commit();

      return true;
    } catch (error) {
      await transaction.rollback();
      throw error; 
    }
  }

  public async likeComment(comment_id: string, user_id: number): Promise<object> {
    const comment = await DB.ArticlesComments.findOne({ where: { uuid: comment_id }});

    if(!comment) {
      throw new HttpException(false, 400, "Comment is not found");
    }

    const transaction = await DB.sequelize.transaction();
    try {
      const [commentLike, commentLikesCount] = await Promise.all([
        DB.ArticleCommentsLikes.findOne({ where: { comment_id: comment.pk, user_id }, transaction }),
        DB.ArticleCommentsLikes.count({ where: { comment_id: comment.pk, user_id }, transaction })
      ]);

      if (!commentLike) {
        await DB.ArticleCommentsLikes.create({ comment_id: comment.pk, user_id }, { transaction });
        await transaction.commit();
        return { comment_id, is_liked: true, likes: commentLikesCount + 1 }; 
      } else {
        await DB.ArticleCommentsLikes.destroy({ where: { comment_id: comment.pk, user_id }, force: true, transaction });
        await transaction.commit();
        return { comment_id, is_liked: false, likes: commentLikesCount - 1 }; 
      }
    }catch(error) {
      await transaction.rollback();
      throw error;
    }
  }
}
