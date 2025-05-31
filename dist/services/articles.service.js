"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ArticleService", {
    enumerable: true,
    get: function() {
        return ArticleService;
    }
});
const _sequelize = require("sequelize");
const _typedi = require("typedi");
const _dblazy = require("../database/db-lazy");
const _HttpException = require("../exceptions/HttpException");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ArticleService = class ArticleService {
    articleParsed(article) {
        var _article_thumbnail, _article_author_avatar;
        return {
            uuid: article.uuid,
            title: article.title,
            description: article.description,
            content: article.content,
            thumbnail: (_article_thumbnail = article.thumbnail) === null || _article_thumbnail === void 0 ? void 0 : _article_thumbnail.uuid,
            author: {
                uuid: article.author.uuid,
                full_name: article.author.full_name || null,
                avatar: ((_article_author_avatar = article.author.avatar) === null || _article_author_avatar === void 0 ? void 0 : _article_author_avatar.uuid) || null
            },
            categories: article.categories.map((articleCategory)=>articleCategory.category),
            views: article.views || 0,
            likes: article.likes || 0,
            comments: article.comments || 0,
            bookmarks: article.bookmarks || 0
        };
    }
    async getArticles(query) {
        const { page = "1", limit = "10", search, order, sort } = query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const where = {};
        if (search) {
            where[_sequelize.Op.or] = [];
            where[_sequelize.Op.or].push({
                [_sequelize.Op.or]: [
                    {
                        title: {
                            [_sequelize.Op.iLike]: `%${search}%`
                        }
                    },
                    {
                        description: {
                            [_sequelize.Op.iLike]: `%${search}%`
                        }
                    },
                    {
                        content: {
                            [_sequelize.Op.iLike]: `%${search}%`
                        }
                    }
                ]
            });
            where[_sequelize.Op.or].push({
                [_sequelize.Op.or]: [
                    {
                        "$author.full_name$": {
                            [_sequelize.Op.iLike]: `%${search}%`
                        }
                    }
                ]
            });
        }
        const orderClause = [];
        if (order && sort) {
            if (sort === "asc" || sort === "desc") {
                orderClause.push([
                    order,
                    sort
                ]);
            }
        }
        const { rows: articles, count } = await (await (0, _dblazy.getDB)()).Articles.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset,
            order: orderClause
        });
        const likeCountPromises = articles.map(async (article)=>{
            return (await (0, _dblazy.getDB)()).ArticlesLikes.count({
                where: {
                    article_id: article.pk
                }
            });
        });
        const likeCounts = await Promise.all(likeCountPromises);
        articles.forEach((article, index)=>{
            article.likes = likeCounts[index];
        });
        const commentCountPromises = articles.map(async (article)=>{
            return (await (0, _dblazy.getDB)()).ArticlesComments.count({
                where: {
                    article_id: article.pk
                }
            });
        });
        const commentCounts = await Promise.all(commentCountPromises);
        articles.forEach((article, index)=>{
            article.comments = commentCounts[index];
        });
        const viewCountPromises = articles.map(async (article)=>{
            return (await (0, _dblazy.getDB)()).ArticlesViews.count({
                where: {
                    article_id: article.pk
                }
            });
        });
        const viewCounts = await Promise.all(viewCountPromises);
        articles.forEach((article, index)=>{
            article.views = viewCounts[index];
        });
        const bookmarkCountPromises = articles.map(async (article)=>{
            return (await (0, _dblazy.getDB)()).ArticlesBookmarks.count({
                where: {
                    article_id: article.pk
                }
            });
        });
        const bookmarkCounts = await Promise.all(bookmarkCountPromises);
        articles.forEach((article, index)=>{
            article.bookmarks = bookmarkCounts[index];
        });
        const pagination = {
            current_page: parseInt(page),
            size_page: articles.length,
            max_page: Math.ceil(count / parseInt(limit)),
            total_data: count
        };
        const transformedArticles = articles.map((article)=>this.articleParsed(article));
        return {
            articles: transformedArticles,
            pagination
        };
    }
    async getArticleById(article_id) {
        const article = await (await (0, _dblazy.getDB)()).Articles.findOne({
            where: {
                uuid: article_id
            }
        });
        if (!article) {
            throw new _HttpException.HttpException(false, 404, "Article is not found");
        }
        const likesCount = await (await (0, _dblazy.getDB)()).ArticlesLikes.count({
            where: {
                article_id: article.pk
            }
        });
        article.likes = likesCount;
        const commentsCount = await (await (0, _dblazy.getDB)()).ArticlesComments.count({
            where: {
                article_id: article.pk
            }
        });
        article.comments = commentsCount;
        const viewCount = await (await (0, _dblazy.getDB)()).ArticlesViews.count({
            where: {
                article_id: article.pk
            }
        });
        article.views = viewCount;
        const bookmarkCount = await (await (0, _dblazy.getDB)()).ArticlesBookmarks.count({
            where: {
                article_id: article.pk
            }
        });
        article.bookmarks = bookmarkCount;
        const response = this.articleParsed(article);
        return response;
    }
    async getArticlesByCategory(query, category_id) {
        const category = await (await (0, _dblazy.getDB)()).Categories.findOne({
            attributes: [
                "pk"
            ],
            where: {
                uuid: category_id
            }
        });
        if (!category) {
            throw new _HttpException.HttpException(false, 400, "Category is not found");
        }
        const articlesCategory = await (await (0, _dblazy.getDB)()).ArticlesCategories.findAll({
            attributes: [
                "article_id"
            ],
            where: {
                category_id: category.pk
            }
        });
        if (!articlesCategory) {
            throw new _HttpException.HttpException(false, 400, "Article with that category is not found");
        }
        const articleIds = articlesCategory.map((articleCategory)=>articleCategory.article_id);
        const { rows: articles } = await (await (0, _dblazy.getDB)()).Articles.findAndCountAll({
            where: {
                pk: {
                    [_sequelize.Op.in]: articleIds
                }
            }
        });
        const likeCountPromises = articles.map(async (article)=>{
            return (await (0, _dblazy.getDB)()).ArticlesLikes.count({
                where: {
                    article_id: article.pk
                }
            });
        });
        const likeCounts = await Promise.all(likeCountPromises);
        articles.forEach((article, index)=>{
            article.likes = likeCounts[index];
        });
        const commentCountPromises = articles.map(async (article)=>{
            return (await (0, _dblazy.getDB)()).ArticlesComments.count({
                where: {
                    article_id: article.pk
                }
            });
        });
        const commentCounts = await Promise.all(commentCountPromises);
        articles.forEach((article, index)=>{
            article.comments = commentCounts[index];
        });
        const viewCountPromises = articles.map(async (article)=>{
            return (await (0, _dblazy.getDB)()).ArticlesViews.count({
                where: {
                    article_id: article.pk
                }
            });
        });
        const viewCounts = await Promise.all(viewCountPromises);
        articles.forEach((article, index)=>{
            article.views = viewCounts[index];
        });
        const bookmarkCountPromises = articles.map(async (article)=>{
            return (await (0, _dblazy.getDB)()).ArticlesBookmarks.count({
                where: {
                    article_id: article.pk
                }
            });
        });
        const bookmarkCounts = await Promise.all(bookmarkCountPromises);
        articles.forEach((article, index)=>{
            article.bookmarks = bookmarkCounts[index];
        });
        const transformedArticles = articles.map((article)=>this.articleParsed(article));
        return {
            articles: transformedArticles,
            pagination: null
        };
    }
    async createArticle(author_id, data) {
        const thumbnail = await (await (0, _dblazy.getDB)()).Files.findOne({
            attributes: [
                "pk"
            ],
            where: {
                uuid: data.thumbnail
            }
        });
        if (!thumbnail) throw new _HttpException.HttpException(false, 404, "File is not found");
        const categories = await (await (0, _dblazy.getDB)()).Categories.findAll({
            attributes: [
                "pk"
            ],
            where: {
                uuid: {
                    [_sequelize.Op.in]: data.categories
                }
            }
        });
        if (categories.length <= 0) {
            throw new _HttpException.HttpException(false, 404, "Categories is not found");
        }
        const transaction = await (await (0, _dblazy.getDB)()).sequelize.transaction();
        try {
            const article = await (await (0, _dblazy.getDB)()).Articles.create({
                title: data.title,
                description: data.description,
                content: data.content,
                thumbnail_id: thumbnail.pk,
                author_id
            }, {
                transaction
            });
            const categoryIds = categories.map((category)=>category.pk);
            await (await (0, _dblazy.getDB)()).ArticlesCategories.bulkCreate(categoryIds.map((categoryId)=>({
                    article_id: article.pk,
                    category_id: categoryId
                })), {
                transaction
            });
            await transaction.commit();
            return this.getArticleById(article.uuid);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async updateArticle(article_id, author_id, data) {
        const article = await (await (0, _dblazy.getDB)()).Articles.findOne({
            where: {
                uuid: article_id
            }
        });
        if (!article) {
            throw new _HttpException.HttpException(false, 400, "Article is not found");
        }
        const updatedData = {};
        if (data.title) updatedData.title = data.title;
        if (data.description) updatedData.description = data.description;
        if (data.content) updatedData.content = data.content;
        if (data.thumbnail) {
            const file = await (await (0, _dblazy.getDB)()).Files.findOne({
                attributes: [
                    "pk"
                ],
                where: {
                    uuid: data.thumbnail,
                    user_id: author_id
                }
            });
            if (!file) {
                throw new _HttpException.HttpException(false, 400, "File is not found");
            }
            updatedData.thumbnail = file.pk;
        }
        if (Object.keys(updatedData).length === 0) {
            throw new _HttpException.HttpException(false, 400, "Some field is required");
        }
        const transaction = await (await (0, _dblazy.getDB)()).sequelize.transaction();
        try {
            if (data.categories) {
                const categories = await (await (0, _dblazy.getDB)()).Categories.findAll({
                    attributes: [
                        "pk"
                    ],
                    where: {
                        uuid: {
                            [_sequelize.Op.in]: data.categories
                        }
                    }
                });
                if (!categories || categories.length !== data.categories.length) {
                    throw new _HttpException.HttpException(false, 400, "Some categories are not found or duplicated");
                }
                if (categories.length >= 0) {
                    await (await (0, _dblazy.getDB)()).ArticlesCategories.destroy({
                        where: {
                            article_id: article.pk
                        },
                        force: true,
                        transaction
                    });
                    const categoryIds = categories.map((category)=>category.pk);
                    await (await (0, _dblazy.getDB)()).ArticlesCategories.bulkCreate(categoryIds.map((categoryId)=>({
                            article_id: article.pk,
                            category_id: categoryId
                        })), {
                        transaction
                    });
                }
            }
            if (Object.keys(updatedData).length > 0) {
                await (await (0, _dblazy.getDB)()).Articles.update(updatedData, {
                    where: {
                        uuid: article_id
                    },
                    returning: true,
                    transaction
                });
            }
            await transaction.commit();
            return this.getArticleById(article.uuid);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async deleteArticle(article_id, author_id) {
        const article = await (await (0, _dblazy.getDB)()).Articles.findOne({
            where: {
                uuid: article_id,
                author_id
            }
        });
        if (!article) {
            throw new _HttpException.HttpException(false, 400, "Article is not found");
        }
        const comments = await (await (0, _dblazy.getDB)()).ArticlesComments.findAll({
            attributes: [
                "pk"
            ],
            where: {
                article_id: article.pk
            }
        });
        const commentIds = comments.map((comment)=>comment.pk);
        const replies = await (await (0, _dblazy.getDB)()).CommentsReplies.findAll({
            attributes: [
                "pk"
            ],
            where: {
                comment_id: {
                    [_sequelize.Op.in]: commentIds
                }
            }
        });
        const replyIds = replies.map((reply)=>reply.pk);
        const transaction = await (await (0, _dblazy.getDB)()).sequelize.transaction();
        try {
            await article.destroy({
                transaction
            });
            await Promise.all([
                (await (0, _dblazy.getDB)()).ArticlesCategories.destroy({
                    where: {
                        article_id: article.pk
                    },
                    transaction
                }),
                (await (0, _dblazy.getDB)()).ArticlesLikes.destroy({
                    where: {
                        article_id: article.pk
                    },
                    transaction
                }),
                (await (0, _dblazy.getDB)()).ArticlesBookmarks.destroy({
                    where: {
                        article_id: article.pk
                    },
                    transaction
                }),
                (await (0, _dblazy.getDB)()).ArticlesComments.destroy({
                    where: {
                        article_id: article.pk
                    },
                    transaction
                }),
                (await (0, _dblazy.getDB)()).ArticleCommentsLikes.destroy({
                    where: {
                        comment_id: {
                            [_sequelize.Op.in]: commentIds
                        }
                    },
                    transaction
                }),
                (await (0, _dblazy.getDB)()).CommentsReplies.destroy({
                    where: {
                        comment_id: {
                            [_sequelize.Op.in]: commentIds
                        }
                    },
                    transaction
                }),
                (await (0, _dblazy.getDB)()).CommentsRepliesLikes.destroy({
                    where: {
                        reply_id: {
                            [_sequelize.Op.in]: replyIds
                        }
                    },
                    transaction
                })
            ]);
            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async likeArticle(user_id, article_id) {
        const article = await (await (0, _dblazy.getDB)()).Articles.findOne({
            attributes: [
                "pk"
            ],
            where: {
                uuid: article_id
            }
        });
        if (!article) {
            throw new _HttpException.HttpException(false, 400, "Article is not found");
        }
        const transaction = await (await (0, _dblazy.getDB)()).sequelize.transaction();
        try {
            const [articleLike, articleLikesCount] = await Promise.all([
                (await (0, _dblazy.getDB)()).ArticlesLikes.findOne({
                    where: {
                        article_id: article.pk,
                        user_id
                    },
                    transaction
                }),
                (await (0, _dblazy.getDB)()).ArticlesLikes.count({
                    where: {
                        article_id: article.pk,
                        user_id
                    },
                    transaction
                })
            ]);
            if (!articleLike) {
                await (await (0, _dblazy.getDB)()).ArticlesLikes.create({
                    article_id: article.pk,
                    user_id
                }, {
                    transaction
                });
                await transaction.commit();
                return {
                    article_id,
                    is_liked: true,
                    likes: articleLikesCount + 1
                };
            } else {
                await (await (0, _dblazy.getDB)()).ArticlesLikes.destroy({
                    where: {
                        article_id: article.pk,
                        user_id
                    },
                    force: true,
                    transaction
                });
                await transaction.commit();
                return {
                    article_id,
                    is_liked: false,
                    likes: articleLikesCount - 1
                };
            }
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async bookmarkArticle(user_id, article_id) {
        const article = await (await (0, _dblazy.getDB)()).Articles.findOne({
            attributes: [
                "pk"
            ],
            where: {
                uuid: article_id
            }
        });
        if (!article) {
            throw new _HttpException.HttpException(false, 400, "Article is not found");
        }
        const transaction = await (await (0, _dblazy.getDB)()).sequelize.transaction();
        try {
            const [articleBookmark, articleBookmarksCount] = await Promise.all([
                (await (0, _dblazy.getDB)()).ArticlesBookmarks.findOne({
                    where: {
                        article_id: article.pk,
                        user_id
                    },
                    transaction
                }),
                (await (0, _dblazy.getDB)()).ArticlesBookmarks.count({
                    where: {
                        article_id: article.pk,
                        user_id
                    },
                    transaction
                })
            ]);
            if (!articleBookmark) {
                await (await (0, _dblazy.getDB)()).ArticlesBookmarks.create({
                    article_id: article.pk,
                    user_id
                }, {
                    transaction
                });
                await transaction.commit();
                return {
                    article_id,
                    is_bookmarked: true,
                    bookmarks: articleBookmarksCount + 1
                };
            } else {
                await (await (0, _dblazy.getDB)()).ArticlesBookmarks.destroy({
                    where: {
                        article_id: article.pk,
                        user_id
                    },
                    force: true,
                    transaction
                });
                await transaction.commit();
                return {
                    article_id,
                    is_bookmarked: false,
                    bookmarks: articleBookmarksCount - 1
                };
            }
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async getBookmarkByMe(user_id) {
        const articleBookmark = await (await (0, _dblazy.getDB)()).ArticlesBookmarks.findAll({
            attributes: [
                "article_id"
            ],
            where: {
                user_id: user_id
            }
        });
        const articleIds = articleBookmark.map((articleBookmark)=>articleBookmark.article_id);
        const articles = await (await (0, _dblazy.getDB)()).Articles.findAll({
            where: {
                pk: {
                    [_sequelize.Op.in]: articleIds
                }
            }
        });
        if (!articleBookmark) {
            throw new _HttpException.HttpException(false, 400, "Bookmark is empty");
        }
        const likeCountPromises = articles.map(async (article)=>{
            return (await (0, _dblazy.getDB)()).ArticlesLikes.count({
                where: {
                    article_id: article.pk
                }
            });
        });
        const likeCounts = await Promise.all(likeCountPromises);
        articles.forEach((article, index)=>{
            article.likes = likeCounts[index];
        });
        const commentCountPromises = articles.map(async (article)=>{
            return (await (0, _dblazy.getDB)()).ArticlesComments.count({
                where: {
                    article_id: article.pk
                }
            });
        });
        const commentCounts = await Promise.all(commentCountPromises);
        articles.forEach((article, index)=>{
            article.comments = commentCounts[index];
        });
        const transformedArticles = articles.map((article)=>this.articleParsed(article));
        return {
            articles: transformedArticles
        };
    }
    async addView(article_id, user_id) {
        const article = await (await (0, _dblazy.getDB)()).Articles.findOne({
            attributes: [
                "pk"
            ],
            where: {
                uuid: article_id
            }
        });
        if (!article) {
            throw new _HttpException.HttpException(false, 400, "Article is not found");
        }
        (await (0, _dblazy.getDB)()).ArticlesViews.create({
            article_id: article.pk,
            user_id
        });
        const startDate = new Date("2023-01-01");
        const endDate = new Date("2023-12-31");
        console.log(await (await (0, _dblazy.getDB)()).ArticlesViews.count({
            where: {
                created_at: {
                    [_sequelize.Op.and]: [
                        {
                            [_sequelize.Op.gte]: startDate
                        },
                        {
                            [_sequelize.Op.lte]: endDate
                        }
                    ]
                }
            }
        }));
        return true;
    }
    async getPopularArticles(query) {
        const { range } = query;
        const startDate = this.calculateStartDate(range);
        const articleViews = await (await (0, _dblazy.getDB)()).ArticlesViews.findAll({
            attributes: [
                'article_id'
            ],
            where: {
                created_at: {
                    [_sequelize.Op.gte]: startDate
                }
            }
        });
        if (!articleViews || articleViews.length === 0) {
            throw new _HttpException.HttpException(false, 400, "There is no popular article");
        }
        const articleIds = articleViews.map((articleView)=>articleView.article_id);
        const articles = await (await (0, _dblazy.getDB)()).Articles.findAll({
            where: {
                pk: {
                    [_sequelize.Op.in]: articleIds
                }
            }
        });
        const likeCountPromises = articles.map(async (article)=>{
            const count = await (await (0, _dblazy.getDB)()).ArticlesLikes.count({
                where: {
                    article_id: article.pk,
                    created_at: {
                        [_sequelize.Op.gte]: startDate
                    }
                }
            });
            return count;
        });
        const commentCountPromises = articles.map(async (article)=>{
            const count = await (await (0, _dblazy.getDB)()).ArticlesComments.count({
                where: {
                    article_id: article.pk,
                    created_at: {
                        [_sequelize.Op.gte]: startDate
                    }
                }
            });
            return count;
        });
        const viewCountPromises = articles.map(async (article)=>{
            const count = await (await (0, _dblazy.getDB)()).ArticlesViews.count({
                where: {
                    article_id: article.pk,
                    created_at: {
                        [_sequelize.Op.gte]: startDate
                    }
                }
            });
            return count;
        });
        const bookmarkCountPromises = articles.map(async (article)=>{
            const count = await (await (0, _dblazy.getDB)()).ArticlesBookmarks.count({
                where: {
                    article_id: article.pk,
                    created_at: {
                        [_sequelize.Op.gte]: startDate
                    }
                }
            });
            return count;
        });
        const [likeCounts, commentCounts, viewCounts, bookmarkCounts] = await Promise.all([
            Promise.all(likeCountPromises),
            Promise.all(commentCountPromises),
            Promise.all(viewCountPromises),
            Promise.all(bookmarkCountPromises)
        ]);
        articles.forEach((article, index)=>{
            article.likes = likeCounts[index];
            article.comments = commentCounts[index];
            article.views = viewCounts[index];
            article.bookmarks = bookmarkCounts[index];
        });
        const transformedArticles = articles.map((article)=>this.articleParsed(article));
        const weight = {
            views: 1,
            likes: 2,
            comments: 3,
            bookmarks: 4
        };
        const sortedArticles = transformedArticles.sort((a, b)=>{
            const aPopularity = weight.views * a.views + weight.likes * a.likes + weight.comments * a.comments + weight.bookmarks * a.bookmarks;
            const bPopularity = weight.views * b.views + weight.likes * b.likes + weight.comments * b.comments + weight.bookmarks * b.bookmarks;
            return bPopularity - aPopularity;
        });
        const totalLikePromises = sortedArticles.map(async (article)=>{
            const articleId = article.uuid;
            const articlePk = await (await (0, _dblazy.getDB)()).Articles.findOne({
                attributes: [
                    "pk"
                ],
                where: {
                    uuid: articleId
                }
            });
            return (await (0, _dblazy.getDB)()).ArticlesLikes.count({
                where: {
                    article_id: articlePk.pk
                }
            });
        });
        const totalCommentPromises = sortedArticles.map(async (article)=>{
            const articleId = article.uuid;
            const articlePk = await (await (0, _dblazy.getDB)()).Articles.findOne({
                attributes: [
                    "pk"
                ],
                where: {
                    uuid: articleId
                }
            });
            return (await (0, _dblazy.getDB)()).ArticlesComments.count({
                where: {
                    article_id: articlePk.pk
                }
            });
        });
        const totalViewPromises = sortedArticles.map(async (article)=>{
            const articleId = article.uuid;
            const articlePk = await (await (0, _dblazy.getDB)()).Articles.findOne({
                attributes: [
                    "pk"
                ],
                where: {
                    uuid: articleId
                }
            });
            return (await (0, _dblazy.getDB)()).ArticlesViews.count({
                where: {
                    article_id: articlePk.pk
                }
            });
        });
        const totalBookmarkPromises = sortedArticles.map(async (article)=>{
            const articleId = article.uuid;
            const articlePk = await (await (0, _dblazy.getDB)()).Articles.findOne({
                attributes: [
                    "pk"
                ],
                where: {
                    uuid: articleId
                }
            });
            return (await (0, _dblazy.getDB)()).ArticlesBookmarks.count({
                where: {
                    article_id: articlePk.pk
                }
            });
        });
        const [totalLikes, totalComments, totalViews, totalBookmarks] = await Promise.all([
            Promise.all(totalLikePromises),
            Promise.all(totalCommentPromises),
            Promise.all(totalViewPromises),
            Promise.all(totalBookmarkPromises)
        ]);
        sortedArticles.forEach((article, index)=>{
            article.likes = totalLikes[index];
            article.comments = totalComments[index];
            article.views = totalViews[index];
            article.bookmarks = totalBookmarks[index];
        });
        return {
            articles: sortedArticles
        };
    }
    calculateStartDate(range) {
        const currentDate = new Date();
        switch(range){
            case "3 days":
                return new Date(currentDate.setDate(currentDate.getDate() - 3));
            case "1 week":
                return new Date(currentDate.setDate(currentDate.getDate() - 7));
            case "today":
                return new Date(currentDate.setHours(0, 0, 0, 0));
            default:
                throw new _HttpException.HttpException(false, 400, "Range is not valid");
        }
    }
};
ArticleService = _ts_decorate([
    (0, _typedi.Service)()
], ArticleService);

//# sourceMappingURL=articles.service.js.map