import { DB } from "@/database";
import { CreateCommentDto, UpdateCommentDto } from "@/dtos/comments.dto";
import { HttpException } from "@/exceptions/HttpException";
import { ArticleComment } from "@/interfaces/article.interface";
import { Service } from "typedi";


@Service()
export class CommentService {
  public async getComments(): Promise<ArticleComment[]> {
    return await DB.ArticlesComments.findAll({ 
        attributes: { 
          exclude: ["pk"],
        },
      });
  }

  public async getCommentsByArticle(article_id: string): Promise<ArticleComment[]> {
    const article = await DB.Articles.findOne({ where: { uuid: article_id }, attributes: ["pk"] });
    return await DB.ArticlesComments.findAll({ 
        attributes: { 
          exclude: ["pk"],
        },
        where: { article_id: article.pk },
      });
  }

  public async createComment(article_id: string, author_id: number, data: CreateCommentDto): Promise<ArticleComment> {
    const article = await DB.Articles.findOne({ where: { uuid: article_id }, attributes: ["pk"] });
    const comment = await DB.ArticlesComments.create({ article_id: article.pk, author_id, ...data });
    delete comment.dataValues.pk;

    return comment;
  }

  public async updateComment(comment_id: string, data: UpdateCommentDto): Promise<ArticleComment> {
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
