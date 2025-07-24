// Import Sequelize operators and instance for database queries
import { Op, Sequelize } from "sequelize";
// Import Service decorator from typedi for dependency injection
import { Service } from "typedi";
// Import function to get database instance lazily
import { getDB } from "@/database/db-lazy";
// Import ArticleModel for ORM operations on articles table
import { ArticleModel } from "@models/articles.model";
// Import interfaces for parsed articles, query params, and pagination
import { ArticleParsed, ArticlePopularQueryParams, ArticleQueryParams } from "@interfaces/article.interface";
import { Pagination } from "@interfaces/common/pagination.interface";
// Import DTOs for creating and updating articles
import { CreateArticleDto, UpdateArticleDto } from "@dtos/articles.dto";
// Import custom HTTP exception for error handling
import { HttpException } from "@exceptions/HttpException";

/**
 * Service class for article-related operations.
 * Handles CRUD, likes, bookmarks, views, and popular article logic.
 */
@Service()
export class ArticleService {
  /**
   * Parses an ArticleModel instance into an ArticleParsed object.
   * @param article - The ArticleModel instance.
   * @returns ArticleParsed - The parsed article object.
   */
  private articleParsed(article: ArticleModel): ArticleParsed {
    return {
      uuid: article.uuid,
      title: article.title,
      description: article.description,
      content: article.content,

      thumbnail: article.thumbnail?.uuid, 
      author: {
        uuid: article.author.uuid,
        full_name: article.author.full_name || null,
        avatar: article.author.avatar?.uuid || null, 
      },
      categories: article.categories.map((articleCategory) => articleCategory.category),
      views: article.views || 0,
      likes: article.likes || 0,
      comments: article.comments || 0,
      bookmarks: article.bookmarks || 0
    };
  }

  /**
   * Retrieves articles with pagination, search, and sorting.
   * @param query - Query parameters for filtering and pagination.
   * @returns Promise<{ articles: ArticleParsed[], pagination: Pagination }>
   */
  public async getArticles(query: ArticleQueryParams): Promise<{ articles: ArticleParsed[], pagination: Pagination }> {
    const { page = "1", limit = "10", search, order, sort } = query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};

    if(search) {
      where[Op.or] = [];

      where[Op.or].push({
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            description: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            content: {
              [Op.iLike]: `%${search}%`,
            },
          },
        ],
      });

      where[Op.or].push({
        [Op.or]: [
          {
            "$author.full_name$": {
              [Op.iLike]: `%${search}%`,
            },
          }
        ],
      });
    }

    const orderClause = [];
    
    if (order && sort) {
      if (sort === "asc" || sort === "desc") {
        orderClause.push([order, sort]);
      }
    }

    const { rows: articles, count } = await (await getDB()).Articles.findAndCountAll({ 
      where,
      limit: parseInt(limit),
      offset,
      order: orderClause
    });

    const likeCountPromises = articles.map(async article => {
      return (await getDB()).ArticlesLikes.count({
        where: { article_id: article.pk }
      });
    });
    
    const likeCounts = await Promise.all(likeCountPromises);
    
    articles.forEach((article, index) => {
      article.likes = likeCounts[index];
    });

    const commentCountPromises = articles.map(async article => {
      return (await getDB()).ArticlesComments.count({
        where: { article_id: article.pk }
      });
    });

    const commentCounts = await Promise.all(commentCountPromises);

    articles.forEach((article, index) => {
      article.comments = commentCounts[index];
    });

    const viewCountPromises = articles.map(async article => {
      return (await getDB()).ArticlesViews.count({
        where: { article_id: article.pk }
      });
    });

    const viewCounts = await Promise.all(viewCountPromises);

    articles.forEach((article, index) => {
      article.views = viewCounts[index];
    });

    const bookmarkCountPromises = articles.map(async article => {
      return (await getDB()).ArticlesBookmarks.count({
        where: { article_id: article.pk }
      });
    });

    const bookmarkCounts = await Promise.all(bookmarkCountPromises);

    articles.forEach((article, index) => {
      article.bookmarks = bookmarkCounts[index];
    });

    const pagination: Pagination = {
      current_page: parseInt(page),
      size_page: articles.length,
      max_page: Math.ceil(count / parseInt(limit)),
      total_data: count,
    };

    const transformedArticles = articles.map(article => this.articleParsed(article));
    return { articles: transformedArticles, pagination };
  }

  /**
   * Retrieves a single article by its UUID.
   * @param article_id - The UUID of the article.
   * @returns Promise<ArticleParsed>
   * @throws HttpException if article is not found.
   */
  public async getArticleById(article_id: string): Promise<ArticleParsed> {
    const article = await (await getDB()).Articles.findOne({
      where: { uuid: article_id },
    })

    if(!article) {
      throw new HttpException(false, 404, "Article is not found");
    }

    const likesCount = await (await getDB()).ArticlesLikes.count({
      where: { article_id: article.pk }
    });
        
    article.likes = likesCount;

    const commentsCount = await (await getDB()).ArticlesComments.count({
      where: { article_id: article.pk }
    });

    article.comments = commentsCount;

    const viewCount = await (await getDB()).ArticlesViews.count({
      where: { article_id: article.pk }
    });

    article.views = viewCount;

    const bookmarkCount = await (await getDB()).ArticlesBookmarks.count({
      where: { article_id: article.pk }
    });

    article.bookmarks = bookmarkCount;

    const response = this.articleParsed(article);
    return response;
  }

  /**
   * Retrieves articles by category UUID with pagination.
   * @param query - Query parameters for filtering and pagination.
   * @param category_id - The UUID of the category.
   * @returns Promise<{ articles: ArticleParsed[], pagination: Pagination }>
   * @throws HttpException if category or articles are not found.
   */
  public async getArticlesByCategory(query: ArticleQueryParams, category_id: string): Promise<{ articles: ArticleParsed[], pagination: Pagination }> {
    const category = await (await getDB()).Categories.findOne({ attributes: ["pk"], where:{ uuid: category_id } });
    if (!category) {
      throw new HttpException(false, 400, "Category is not found");
    }

    const articlesCategory = await (await getDB()).ArticlesCategories.findAll({ attributes: ["article_id"], where: { category_id: category.pk } });

    if(!articlesCategory) {
      throw new HttpException(false, 400, "Article with that category is not found");
    }

    const articleIds = articlesCategory.map(articleCategory => articleCategory.article_id);

    const { rows: articles } = await (await getDB()).Articles.findAndCountAll({ 
      where: { 
        pk: { [Op.in]: articleIds }
      }
    });
    
    const likeCountPromises = articles.map(async article => {

      return (await getDB()).ArticlesLikes.count({
        where: { article_id: article.pk }
      });
    });

    const likeCounts = await Promise.all(likeCountPromises);
    
    
    articles.forEach((article, index) => {
      article.likes = likeCounts[index];
    });

    const commentCountPromises = articles.map(async article => {
      return (await getDB()).ArticlesComments.count({
        where: { article_id: article.pk }
      });
    });

    const commentCounts = await Promise.all(commentCountPromises);

    articles.forEach((article, index) => {
      article.comments = commentCounts[index];
    });

    const viewCountPromises = articles.map(async article => {
      return (await getDB()).ArticlesViews.count({
        where: { article_id: article.pk }
      });
    });

    const viewCounts = await Promise.all(viewCountPromises);

    articles.forEach((article, index) => {
      article.views = viewCounts[index];
    });

    const bookmarkCountPromises = articles.map(async article => {
      return (await getDB()).ArticlesBookmarks.count({
        where: { article_id: article.pk }
      });
    });

    const bookmarkCounts = await Promise.all(bookmarkCountPromises);

    articles.forEach((article, index) => {
      article.bookmarks = bookmarkCounts[index];
    });


    const transformedArticles = articles.map(article => this.articleParsed(article));
    return { articles: transformedArticles, pagination: null };
  }

  /**
   * Creates a new article with the given author and data.
   * @param author_id - The author's user ID.
   * @param data - DTO containing article creation fields.
   * @returns Promise<ArticleParsed>
   * @throws HttpException if thumbnail or categories are not found.
   */
  public async createArticle(author_id: number, data: CreateArticleDto): Promise<ArticleParsed> {
    const thumbnail = await (await getDB()).Files.findOne({ attributes: ["pk"], where: { uuid: data.thumbnail }});
    if(!thumbnail) throw new HttpException(false, 404, "File is not found");
    
    const categories = await (await getDB()).Categories.findAll({
      attributes: ["pk"],
      where: {
        uuid: { [Op.in]: data.categories }
      }
    })

    if (categories.length <= 0) {
      throw new HttpException(false, 404, "Categories is not found");
    }

    const transaction = await (await getDB()).sequelize.transaction();

    try {
      const article = await (await getDB()).Articles.create({
        title: data.title,
        description: data.description,
        content: data.content,
        thumbnail_id: thumbnail.pk,
        author_id
      }, { transaction});

      const categoryIds = categories.map(category => category.pk);

      await (await getDB()).ArticlesCategories.bulkCreate(
        categoryIds.map(categoryId => ({
          article_id: article.pk,
          category_id: categoryId
        })),
        { transaction }
      );

      await transaction.commit();
      return this.getArticleById(article.uuid);
    } catch (error) {
      await transaction.rollback();
      throw error; 
    }
  }
  
  /**
   * Updates an existing article by its UUID and author ID.
   * @param article_id - The UUID of the article.
   * @param author_id - The author's user ID.
   * @param data - DTO containing article update fields.
   * @returns Promise<ArticleParsed>
   * @throws HttpException if article, file, or categories are not found.
   */
  public async updateArticle(article_id: string, author_id: number, data: UpdateArticleDto): Promise<ArticleParsed> {
    const article = await (await getDB()).Articles.findOne({ where: { uuid: article_id }});

    if(!article) {
      throw new HttpException(false, 400, "Article is not found");
    }
    
    const updatedData: any = {};
    
    if (data.title) updatedData.title = data.title;
    if (data.description) updatedData.description = data.description;
    if (data.content) updatedData.content = data.content;
    
    if (data.thumbnail) {
      const file = await (await getDB()).Files.findOne({ 
        attributes: ["pk"], 
        where: { 
          uuid: data.thumbnail, 
          user_id: author_id 
        } 
      });
      
      if (!file) {
        throw new HttpException(false, 400, "File is not found");
      }
  
      updatedData.thumbnail = file.pk;
    }

    if (Object.keys(updatedData).length === 0) {
      throw new HttpException(false, 400, "Some field is required");
    }

    const transaction = await (await getDB()).sequelize.transaction();
    try {
      if (data.categories) {
        const categories = await (await getDB()).Categories.findAll({
          attributes: ["pk"],
          where: {
            uuid: { [Op.in]: data.categories }
          }
        });

        if (!categories || categories.length !== data.categories.length) {
          throw new HttpException(false, 400, "Some categories are not found or duplicated");
        }

        if (categories.length >= 0) {
          await (await getDB()).ArticlesCategories.destroy({
            where: { article_id: article.pk },
            force: true,
            transaction
          });

          const categoryIds = categories.map(category => category.pk);

          await (await getDB()).ArticlesCategories.bulkCreate(
            categoryIds.map(categoryId => ({
              article_id: article.pk,
              category_id: categoryId
            })), { transaction }
          );
        }
      }

      if (Object.keys(updatedData).length > 0) {
        await (await getDB()).Articles.update(updatedData, {
          where: { uuid: article_id },
          returning: true,
          transaction,
        });
      }

      await transaction.commit();

      return this.getArticleById(article.uuid);
    } catch (error) {
      await transaction.rollback();
      throw error; 
    }
  }

  /**
   * Deletes an article and all its related data (comments, likes, bookmarks, etc).
   * @param article_id - The UUID of the article.
   * @param author_id - The author's user ID.
   * @returns Promise<boolean> - True if deletion is successful.
   * @throws HttpException if article is not found.
   */
  public async deleteArticle(article_id: string, author_id: number): Promise<boolean> {
    const article = await (await getDB()).Articles.findOne({ where: { uuid: article_id, author_id }});
    if (!article) {
      throw new HttpException(false, 400, "Article is not found");
    }

    const comments = await (await getDB()).ArticlesComments.findAll({ attributes: ["pk"], where: { article_id: article.pk }});
    const commentIds = comments.map(comment => comment.pk);

    const replies = await (await getDB()).CommentsReplies.findAll({ attributes: ["pk"], where: { comment_id: { [Op.in]: commentIds } }});
    const replyIds = replies.map(reply => reply.pk);

    const transaction = await (await getDB()).sequelize.transaction();
    try {
      await article.destroy({ transaction });

      await Promise.all([
        (await getDB()).ArticlesCategories.destroy({ where: { article_id: article.pk }, transaction }),
        (await getDB()).ArticlesLikes.destroy({ where: { article_id: article.pk }, transaction }),
        (await getDB()).ArticlesBookmarks.destroy({ where: { article_id: article.pk }, transaction }),
        (await getDB()).ArticlesComments.destroy({ where: { article_id: article.pk }, transaction }),
        (await getDB()).ArticleCommentsLikes.destroy({ where: { comment_id: { [Op.in]: commentIds } }, transaction }),
        (await getDB()).CommentsReplies.destroy({ where: { comment_id: { [Op.in]: commentIds } }, transaction }),
        (await getDB()).CommentsRepliesLikes.destroy({ where: { reply_id: { [Op.in]: replyIds } }, transaction }),
      ]);
      
      await transaction.commit();

      return true;
    } catch (error) {
      await transaction.rollback();
      throw error; 
    }
  }

  /**
   * Likes or unlikes an article for a user.
   * @param user_id - The user's ID.
   * @param article_id - The UUID of the article.
   * @returns Promise<object> - Like status and count.
   * @throws HttpException if article is not found.
   */
  public async likeArticle(user_id: number, article_id: string): Promise<object> {
    const article = await (await getDB()).Articles.findOne({ attributes: ["pk"], where: { uuid: article_id } });
    if (!article) {
      throw new HttpException(false, 400, "Article is not found");
    }

    const transaction = await (await getDB()).sequelize.transaction();
    try {
      const [articleLike, articleLikesCount] = await Promise.all([
        (await getDB()).ArticlesLikes.findOne({ where: { article_id: article.pk, user_id }, transaction }),
        (await getDB()).ArticlesLikes.count({ where: { article_id: article.pk, user_id }, transaction })
      ]);
  
      if (!articleLike) {
        await (await getDB()).ArticlesLikes.create({ article_id: article.pk, user_id }, { transaction });
        await transaction.commit();
        return { article_id, is_liked: true, likes: articleLikesCount + 1 }; 
      } else {
        await (await getDB()).ArticlesLikes.destroy({ where: { article_id: article.pk, user_id }, force: true, transaction });
        await transaction.commit();
        return { article_id, is_liked: false, likes: articleLikesCount - 1 }; 
      }
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Bookmarks or unbookmarks an article for a user.
   * @param user_id - The user's ID.
   * @param article_id - The UUID of the article.
   * @returns Promise<object> - Bookmark status and count.
   * @throws HttpException if article is not found.
   */
  public async bookmarkArticle(user_id: number, article_id: string): Promise<object> {
    const article = await (await getDB()).Articles.findOne({ attributes: ["pk"], where: { uuid: article_id } });
    if (!article) {
      throw new HttpException(false, 400, "Article is not found");
    }

    const transaction = await (await getDB()).sequelize.transaction();
    try {
      const [articleBookmark, articleBookmarksCount] = await Promise.all([
        (await getDB()).ArticlesBookmarks.findOne({ where: { article_id: article.pk, user_id }, transaction }),
        (await getDB()).ArticlesBookmarks.count({ where: { article_id: article.pk, user_id }, transaction })
      ]);
  
      if (!articleBookmark) {
        await (await getDB()).ArticlesBookmarks.create({ article_id: article.pk, user_id }, { transaction });
        await transaction.commit();
        return { article_id, is_bookmarked: true, bookmarks: articleBookmarksCount + 1 }; 
      } else {
        await (await getDB()).ArticlesBookmarks.destroy({ where: { article_id: article.pk, user_id }, force: true, transaction });
        await transaction.commit();
        return { article_id, is_bookmarked: false, bookmarks: articleBookmarksCount - 1 }; 
      }
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Retrieves articles bookmarked by the user.
   * @param user_id - The user's ID.
   * @returns Promise<{articles: ArticleParsed[]}>
   * @throws HttpException if bookmarks are empty.
   */
  public async getBookmarkByMe(user_id: number): Promise<{articles: ArticleParsed[]}> {

    const articleBookmark = await (await getDB()).ArticlesBookmarks.findAll({ attributes: ["article_id"], where: { user_id: user_id } });

    const articleIds = articleBookmark.map(articleBookmark => articleBookmark.article_id);

    const articles = await (await getDB()).Articles.findAll({ 
      where: { 
        pk: { [Op.in]: articleIds }
      }
    });

    if (!articleBookmark) {
      throw new HttpException(false, 400, "Bookmark is empty");
    }

    const likeCountPromises = articles.map(async article => {
      return (await getDB()).ArticlesLikes.count({
        where: { article_id: article.pk }
      });
    });
    
    const likeCounts = await Promise.all(likeCountPromises);
    
    articles.forEach((article, index) => {
      article.likes = likeCounts[index];
    });

    const commentCountPromises = articles.map(async article => {
      return (await getDB()).ArticlesComments.count({
        where: { article_id: article.pk }
      });
    });

    const commentCounts = await Promise.all(commentCountPromises);

    articles.forEach((article, index) => {
      article.comments = commentCounts[index];
    });

    const transformedArticles = articles.map(article => this.articleParsed(article));

    return { articles: transformedArticles };
  }

  /**
   * Adds a view to an article for a user.
   * @param article_id - The UUID of the article.
   * @param user_id - The user's ID.
   * @returns Promise<boolean> - True if view is added.
   * @throws HttpException if article is not found.
   */
  public async addView(article_id: string, user_id: number): Promise<boolean> {
    const article = await (await getDB()).Articles.findOne({ attributes: ["pk"], where: { uuid: article_id } });
    if (!article) {
      throw new HttpException(false, 400, "Article is not found");
    }

    (await getDB()).ArticlesViews.create({ article_id: article.pk, user_id });
    const startDate = new Date("2023-01-01");
    const endDate = new Date("2023-12-31");
    console.log(await (await getDB()).ArticlesViews.count({ 
      where: {
        created_at: {
          [Op.and]: [
            { [Op.gte]: startDate }, // Tanggal lebih besar atau sama dengan startDate
            { [Op.lte]: endDate }    // Tanggal kurang dari atau sama dengan endDate
          ]
        }
      }
    }))

    return true
  } 

  /**
   * Retrieves popular articles based on views, likes, comments, and bookmarks in a date range.
   * @param query - Query parameters including range.
   * @returns Promise<{ articles: ArticleParsed[] }>
   * @throws HttpException if no popular articles are found or range is invalid.
   */
  public async getPopularArticles(query: ArticlePopularQueryParams): Promise<{ articles: ArticleParsed[] }> {
    const { range } = query;
    const startDate = this.calculateStartDate(range);
  
    const articleViews = await (await getDB()).ArticlesViews.findAll({
      attributes: ['article_id'],
      where: {
        created_at: {
          [Op.gte]: startDate,
        },
      },
    });
  
    if (!articleViews || articleViews.length === 0) {
      throw new HttpException(false, 400, "There is no popular article");
    }
  
    const articleIds = articleViews.map(articleView => articleView.article_id);
  
    const articles = await (await getDB()).Articles.findAll({
      where: {
        pk: { [Op.in]: articleIds }
      }
    });
  
    // Hitung berdasarkan date range untuk menentukan popularitas
    const likeCountPromises = articles.map(async (article) => {
      const count = await (await getDB()).ArticlesLikes.count({
        where: {
          article_id: article.pk,
          created_at: {
            [Op.gte]: startDate,
          },
        },
      });
      return count;
    });
  
    const commentCountPromises = articles.map(async (article) => {
      const count = await (await getDB()).ArticlesComments.count({
        where: {
          article_id: article.pk,
          created_at: {
            [Op.gte]: startDate,
          },
        },
      });
      return count;
    });
  
    const viewCountPromises = articles.map(async (article) => {
      const count = await (await getDB()).ArticlesViews.count({
        where: {
          article_id: article.pk,
          created_at: {
            [Op.gte]: startDate,
          },
        },
      });
      return count;
    });
  
    const bookmarkCountPromises = articles.map(async (article) => {
      const count = await (await getDB()).ArticlesBookmarks.count({
        where: {
          article_id: article.pk,
          created_at: {
            [Op.gte]: startDate,
          },
        },
      });
      return count;
    });
  
    const [likeCounts, commentCounts, viewCounts, bookmarkCounts] = await Promise.all([
      Promise.all(likeCountPromises),
      Promise.all(commentCountPromises),
      Promise.all(viewCountPromises),
      Promise.all(bookmarkCountPromises),
    ]);
  
    articles.forEach((article, index) => {
      article.likes = likeCounts[index];
      article.comments = commentCounts[index];
      article.views = viewCounts[index];
      article.bookmarks = bookmarkCounts[index];
    });
  
    const transformedArticles = articles.map(article => this.articleParsed(article));
  
    const weight = {
      views: 1,
      likes: 2,
      comments: 3,
      bookmarks: 4,
    };
  
    // Mengurutkan artikel berdasarkan bobotnya
    const sortedArticles = transformedArticles.sort((a, b) => {
      const aPopularity = (weight.views * a.views) + (weight.likes * a.likes) + (weight.comments * a.comments) + (weight.bookmarks * a.bookmarks);
      const bPopularity = (weight.views * b.views) + (weight.likes * b.likes) + (weight.comments * b.comments) + (weight.bookmarks * b.bookmarks);
  
      return bPopularity - aPopularity;
    });

  
    // Tampilkan jumlah views, likes, comments, dan bookmarks yang sesuai
    const totalLikePromises = sortedArticles.map(async (article) => {
      const articleId = article.uuid;
      const articlePk = await (await getDB()).Articles.findOne({
        attributes: ["pk"],
        where: {
          uuid: articleId,
        },
      });
      return (await getDB()).ArticlesLikes.count({
        where: {
          article_id: articlePk.pk,
        },
      });
    });

    const totalCommentPromises = sortedArticles.map(async (article) => {
      const articleId = article.uuid;
      const articlePk = await (await getDB()).Articles.findOne({
        attributes: ["pk"],
        where: {
          uuid: articleId,
        },
      });
      return (await getDB()).ArticlesComments.count({
        where: {
          article_id: articlePk.pk,
        },
      });
    });

    const totalViewPromises = sortedArticles.map(async (article) => {
      const articleId = article.uuid;
      const articlePk = await (await getDB()).Articles.findOne({
        attributes: ["pk"],
        where: {
          uuid: articleId,
        },
      });
      return (await getDB()).ArticlesViews.count({
        where: {
          article_id: articlePk.pk,
        },
      });
    });

    const totalBookmarkPromises = sortedArticles.map(async (article) => {
      const articleId = article.uuid;
      const articlePk = await (await getDB()).Articles.findOne({
        attributes: ["pk"],
        where: {
          uuid: articleId,
        },
      });
      return (await getDB()).ArticlesBookmarks.count({
        where: {
          article_id: articlePk.pk,
        },
      });
    });

    const [totalLikes, totalComments, totalViews, totalBookmarks] = await Promise.all([
      Promise.all(totalLikePromises),
      Promise.all(totalCommentPromises),
      Promise.all(totalViewPromises),
      Promise.all(totalBookmarkPromises),
    ]);

    sortedArticles.forEach((article, index) => {
      article.likes = totalLikes[index];
      article.comments = totalComments[index];
      article.views = totalViews[index];
      article.bookmarks = totalBookmarks[index];
    });

    return { articles: sortedArticles };
  }
  


  /**
   * Calculates the start date for popular article queries based on range string.
   * @param range - The range string (e.g., "3 days", "1 week", "today").
   * @returns Date - The calculated start date.
   * @throws HttpException if range is not valid.
   */
  private calculateStartDate(range: string): Date {
    const currentDate = new Date();
    switch (range) {
      case "3 days":
        return new Date(currentDate.setDate(currentDate.getDate() - 3));
      case "1 week":
        return new Date(currentDate.setDate(currentDate.getDate() - 7));
      case "today":
        return new Date(currentDate.setHours(0, 0, 0, 0));
      default:
        throw new HttpException(false, 400, "Range is not valid");
    }
    
  }
  
}