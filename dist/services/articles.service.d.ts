import { ArticleParsed, ArticlePopularQueryParams, ArticleQueryParams } from "../interfaces/article.interface";
import { Pagination } from "../interfaces/common/pagination.interface";
import { CreateArticleDto, UpdateArticleDto } from "../dtos/articles.dto";
export declare class ArticleService {
    private articleParsed;
    getArticles(query: ArticleQueryParams): Promise<{
        articles: ArticleParsed[];
        pagination: Pagination;
    }>;
    getArticleById(article_id: string): Promise<ArticleParsed>;
    getArticlesByCategory(query: ArticleQueryParams, category_id: string): Promise<{
        articles: ArticleParsed[];
        pagination: Pagination;
    }>;
    createArticle(author_id: number, data: CreateArticleDto): Promise<ArticleParsed>;
    updateArticle(article_id: string, author_id: number, data: UpdateArticleDto): Promise<ArticleParsed>;
    deleteArticle(article_id: string, author_id: number): Promise<boolean>;
    likeArticle(user_id: number, article_id: string): Promise<object>;
    bookmarkArticle(user_id: number, article_id: string): Promise<object>;
    getBookmarkByMe(user_id: number): Promise<{
        articles: ArticleParsed[];
    }>;
    addView(article_id: string, user_id: number): Promise<boolean>;
    getPopularArticles(query: ArticlePopularQueryParams): Promise<{
        articles: ArticleParsed[];
    }>;
    private calculateStartDate;
}
