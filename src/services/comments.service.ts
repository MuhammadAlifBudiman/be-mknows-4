import { DB } from "@/database";
import { CreateCommentDto, UpdateCommentDto } from "@/dtos/comments.dto";
import { HttpException } from "@/exceptions/HttpException";
import { Comment, CommentParsed } from "@/interfaces/comment.interface";
import { ArticleCommentModel } from "@/models/articles_comments.model";
import { Service } from "typedi";


@Service()
export class CommentService {
  private commentParsed(comment: ArticleCommentModel): CommentParsed {
    return {
      uuid: comment.uuid,
      article_id: comment.article_id,
      author_id: comment.author_id,
      comment: comment.comment,
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

    const transformedComments = comments.map(comment => this.commentParsed(comment));

    return { comments: transformedComments };
  }

  public async getCommentsByArticle(article_id: string): Promise<Comment[]> {
    const article = await DB.Articles.findOne({ where: { uuid: article_id }, attributes: ["pk"] });
    const comments = await DB.ArticlesComments.findAll({ where: { article_id: article.pk } });
    const repliesCountPromises = comments.map(comment => {
      return DB.CommentsReplies.count({
        where: { comment_id: comment.pk }
      });
    });
    const repliesCount = await Promise.all(repliesCountPromises);

    comments.forEach((comment, index) => {
      comment.dataValues.replies = repliesCount[index];
    });
    return comments;
  }

  public async createComment(article_id: string, author_id: number, data: CreateCommentDto): Promise<Comment> {
    const article = await DB.Articles.findOne({ where: { uuid: article_id }, attributes: ["pk"] });
    const comment = await DB.ArticlesComments.create({ article_id: article.pk, author_id, ...data, replies: 0 });
    delete comment.dataValues.pk;

    return comment;
  }

  public async updateComment(comment_id: string, data: UpdateCommentDto): Promise<Comment> {
    const updatedData: any = {};
    
    if (data.comment) updatedData.comment = data.comment;

    if (Object.keys(updatedData).length === 0) {
      throw new HttpException(false, 400, "Some field is required");
    }

    const [_, [comment]] = await DB.ArticlesComments.update(updatedData, {
      where: { uuid: comment_id },
      returning: true,
    });
    
    delete comment.dataValues.pk;

    return comment;
  }

  public async deleteComment(comment_id: string): Promise<boolean> {
    const comment = await DB.ArticlesComments.findOne({ where: { uuid: comment_id }});

    if(!comment) {
      throw new HttpException(false, 400, "Comment is not found");
    }

    await comment.destroy();
    return true;
  }
}
