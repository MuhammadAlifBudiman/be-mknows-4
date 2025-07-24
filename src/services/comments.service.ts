// Import function to get database instance lazily
import { getDB } from "@/database/db-lazy";
// Import DTOs for creating and updating comments
import { CreateCommentDto, UpdateCommentDto } from "@/dtos/comments.dto";
// Import custom HTTP exception for error handling
import { HttpException } from "@exceptions/HttpException";
// Import interfaces for comment and parsed comment structure
import { Comment, CommentParsed } from "@/interfaces/comment.interface";
// Import ArticleCommentModel for ORM operations on article comments
import { ArticleCommentModel } from "@/models/articles_comments.model";
// Import Service decorator from typedi for dependency injection
import { Service } from "typedi";
// Import Sequelize operators for advanced queries
import { Op } from "sequelize";

/**
 * Service class for comment-related operations.
 * Handles CRUD, likes, replies, and parsing logic for comments.
 */
@Service()
export class CommentService {
  /**
   * Parses an ArticleCommentModel instance into a CommentParsed object.
   * @param comment - The ArticleCommentModel instance.
   * @returns CommentParsed - The parsed comment object.
   */
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

  /**
   * Retrieves all comments with their like and reply counts.
   * @returns Promise<{comments: CommentParsed[]}> - Array of parsed comments.
   */
  public async getComments(): Promise<{comments: CommentParsed[]}> {
    const DB = await getDB();
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

  /**
   * Retrieves comments for a specific article by its UUID.
   * @param article_id - The UUID of the article.
   * @returns Promise<{comments: CommentParsed[]}> - Array of parsed comments.
   * @throws HttpException if article or comments are not found.
   */
  public async getCommentsByArticle(article_id: string): Promise<{comments: CommentParsed[]}> {
    const DB = await getDB();
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

  /**
   * Retrieves a single comment by its UUID.
   * @param comment_id - The UUID of the comment.
   * @returns Promise<CommentParsed> - The parsed comment object.
   */
  public async getCommentById(comment_id: string): Promise<CommentParsed> {
    const DB = await getDB();
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

  /**
   * Creates a new comment for an article and author.
   * @param article_id - The UUID of the article.
   * @param author_id - The author's user ID.
   * @param data - DTO containing comment creation fields.
   * @returns Promise<CommentParsed> - The created comment object.
   */
  public async createComment(article_id: string, author_id: number, data: CreateCommentDto): Promise<CommentParsed> {
    const DB = await getDB();
    const article = await DB.Articles.findOne({ where: { uuid: article_id }, attributes: ["pk"] });
    const comment = await DB.ArticlesComments.create({ article_id: article.pk, author_id, ...data });
    delete comment.dataValues.pk;

    return this.getCommentById(comment.uuid);
  }

  /**
   * Updates an existing comment by its UUID.
   * @param comment_id - The UUID of the comment.
   * @param data - DTO containing comment update fields.
   * @returns Promise<CommentParsed> - The updated comment object.
   * @throws HttpException if no fields are provided.
   */
  public async updateComment(comment_id: string, data: UpdateCommentDto): Promise<CommentParsed> {
    const DB = await getDB();
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

  /**
   * Deletes a comment and all its related replies and likes.
   * @param comment_id - The UUID of the comment.
   * @returns Promise<boolean> - True if deletion is successful.
   * @throws HttpException if comment is not found.
   */
  public async deleteComment(comment_id: string): Promise<boolean> {
    const DB = await getDB();
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

  /**
   * Likes or unlikes a comment for a user.
   * @param comment_id - The UUID of the comment.
   * @param user_id - The user's ID.
   * @returns Promise<object> - Like status and count.
   * @throws HttpException if comment is not found.
   */
  public async likeComment(comment_id: string, user_id: number): Promise<object> {
    const DB = await getDB();
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
