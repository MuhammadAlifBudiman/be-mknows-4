/**
 * Interfaces for articles, article categories, query parameters, and related entities.
 * Used to define the structure of article data and related operations in the application.
 */
import { Category } from "@interfaces/category.interface";

/**
 * Main article entity interface.
 * - pk: Primary key
 * - uuid: Unique identifier
 * - title, description, content: Article details
 * - thumbnail_id: Thumbnail image ID
 * - author_id: Author's user ID
 * - categories: Optional array of article-category relations
 * - views, likes, comments, bookmarks: Optional counts
 */
export interface Article {
  pk: number;
  uuid: string;
  title: string;
  description: string;
  content: string;
  thumbnail_id: number;
  author_id: number;
  categories?: ArticleCategory[];
  views?: number;
  likes?: number;
  comments?: number;
  bookmarks?: number;
}

/**
 * Relationship between an article and a category.
 * - article_id: Article's primary key
 * - category_id: Category's primary key
 * - category: Optional category object
 */
export interface ArticleCategory {
  article_id: number;
  category_id: number;
  category?: Category;
}

/**
 * Query parameters for fetching articles.
 * - page, limit, search, order, sort: Optional query strings
 */
export interface ArticleQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  order?: string;
  sort?: string;
}

/**
 * Parsed article structure for API responses.
 * - uuid, title, description, content, thumbnail
 * - author: Object with uuid, full_name, avatar
 * - categories: Array of categories
 * - views, likes, comments, bookmarks: Counts
 */
export interface ArticleParsed {
  uuid: string;
  title: string;
  description: string;
  content: string;
  thumbnail: string;
  author: {
    uuid: string;
    full_name: string;
    avatar: string;
  },
  categories: Category[];
  views: number;
  likes: number;
  comments: number;
  bookmarks: number;
}

/**
 * Like entity for an article.
 * - article_id: Article's primary key
 * - user_id: User's primary key
 */
export interface ArticleLike {
  article_id: number;
  user_id: number;
}

/**
 * Bookmark entity for an article.
 * - article_id: Article's primary key
 * - user_id: User's primary key
 */
export interface ArticleBookmark {
  article_id: number;
  user_id: number;
}

/**
 * View entity for an article.
 * - article_id: Article's primary key
 * - user_id: User's primary key
 */
export interface ArticleView {
  article_id: number;
  user_id: number;
}

/**
 * Query parameters for fetching popular articles.
 * - range: Optional string for time range
 */
export interface ArticlePopularQueryParams {
  range?: string;
}
