"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CommentService", {
    enumerable: true,
    get: function() {
        return CommentService;
    }
});
const _database = require("../database");
const _HttpException = require("../exceptions/HttpException");
const _typedi = require("typedi");
const _sequelize = require("sequelize");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CommentService = class CommentService {
    commentParsed(comment) {
        var _comment_author_avatar;
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
                avatar: ((_comment_author_avatar = comment.author.avatar) === null || _comment_author_avatar === void 0 ? void 0 : _comment_author_avatar.uuid) || null
            },
            likes: comment.likes || 0,
            replies: comment.replies || 0
        };
    }
    async getComments() {
        const comments = await _database.DB.ArticlesComments.findAll({});
        const repliesCountPromises = comments.map((comment)=>{
            return _database.DB.CommentsReplies.count({
                where: {
                    comment_id: comment.pk
                }
            });
        });
        const repliesCount = await Promise.all(repliesCountPromises);
        comments.forEach((comment, index)=>{
            comment.replies = repliesCount[index];
        });
        const likeCountPromises = comments.map((comment)=>{
            return _database.DB.ArticleCommentsLikes.count({
                where: {
                    comment_id: comment.pk
                }
            });
        });
        const likesCount = await Promise.all(likeCountPromises);
        comments.forEach((comment, index)=>{
            comment.likes = likesCount[index];
        });
        const transformedComments = comments.map((comment)=>this.commentParsed(comment));
        return {
            comments: transformedComments
        };
    }
    async getCommentsByArticle(article_id) {
        const article = await _database.DB.Articles.findOne({
            where: {
                uuid: article_id
            },
            attributes: [
                "pk"
            ]
        });
        if (!article) {
            throw new _HttpException.HttpException(false, 404, "Article is not found");
        }
        const comments = await _database.DB.ArticlesComments.findAll({
            where: {
                article_id: article.pk
            }
        });
        if (!comments) {
            throw new _HttpException.HttpException(false, 404, "Comment is not found");
        }
        const repliesCountPromises = comments.map((comment)=>{
            return _database.DB.CommentsReplies.count({
                where: {
                    comment_id: comment.pk
                }
            });
        });
        const repliesCount = await Promise.all(repliesCountPromises);
        comments.forEach((comment, index)=>{
            comment.replies = repliesCount[index];
        });
        const likeCountPromises = comments.map((comment)=>{
            return _database.DB.ArticleCommentsLikes.count({
                where: {
                    comment_id: comment.pk
                }
            });
        });
        const likesCount = await Promise.all(likeCountPromises);
        comments.forEach((comment, index)=>{
            comment.likes = likesCount[index];
        });
        const transformedComments = comments.map((comment)=>this.commentParsed(comment));
        return {
            comments: transformedComments
        };
    }
    async getCommentById(comment_id) {
        const comment = await _database.DB.ArticlesComments.findOne({
            where: {
                uuid: comment_id
            }
        });
        const likesCount = await _database.DB.ArticleCommentsLikes.count({
            where: {
                comment_id: comment.pk
            }
        });
        comment.likes = likesCount;
        const repliesCount = await _database.DB.CommentsReplies.count({
            where: {
                comment_id: comment.pk
            }
        });
        comment.replies = repliesCount;
        const response = this.commentParsed(comment);
        return response;
    }
    async createComment(article_id, author_id, data) {
        const article = await _database.DB.Articles.findOne({
            where: {
                uuid: article_id
            },
            attributes: [
                "pk"
            ]
        });
        const comment = await _database.DB.ArticlesComments.create(_object_spread({
            article_id: article.pk,
            author_id
        }, data));
        delete comment.dataValues.pk;
        return this.getCommentById(comment.uuid);
    }
    async updateComment(comment_id, data) {
        const comment = await _database.DB.ArticlesComments.findOne({
            where: {
                uuid: comment_id
            }
        });
        const updatedData = {};
        if (data.comment) updatedData.comment = data.comment;
        if (Object.keys(updatedData).length === 0) {
            throw new _HttpException.HttpException(false, 400, "Some field is required");
        }
        if (Object.keys(updatedData).length > 0) {
            await _database.DB.ArticlesComments.update(updatedData, {
                where: {
                    uuid: comment_id
                },
                returning: true
            });
        }
        return this.getCommentById(comment_id);
    }
    async deleteComment(comment_id) {
        const comment = await _database.DB.ArticlesComments.findOne({
            where: {
                uuid: comment_id
            }
        });
        if (!comment) {
            throw new _HttpException.HttpException(false, 400, "Comment is not found");
        }
        const replies = await _database.DB.CommentsReplies.findAll({
            attributes: [
                "pk"
            ],
            where: {
                comment_id: comment.pk
            }
        });
        const replyIds = replies.map((reply)=>reply.pk);
        const transaction = await _database.DB.sequelize.transaction();
        try {
            await comment.destroy({
                transaction
            });
            await Promise.all([
                _database.DB.ArticleCommentsLikes.destroy({
                    where: {
                        comment_id: comment.pk
                    },
                    transaction
                }),
                _database.DB.CommentsReplies.destroy({
                    where: {
                        comment_id: comment.pk
                    },
                    transaction
                }),
                _database.DB.CommentsRepliesLikes.destroy({
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
    async likeComment(comment_id, user_id) {
        const comment = await _database.DB.ArticlesComments.findOne({
            where: {
                uuid: comment_id
            }
        });
        if (!comment) {
            throw new _HttpException.HttpException(false, 400, "Comment is not found");
        }
        const transaction = await _database.DB.sequelize.transaction();
        try {
            const [commentLike, commentLikesCount] = await Promise.all([
                _database.DB.ArticleCommentsLikes.findOne({
                    where: {
                        comment_id: comment.pk,
                        user_id
                    },
                    transaction
                }),
                _database.DB.ArticleCommentsLikes.count({
                    where: {
                        comment_id: comment.pk,
                        user_id
                    },
                    transaction
                })
            ]);
            if (!commentLike) {
                await _database.DB.ArticleCommentsLikes.create({
                    comment_id: comment.pk,
                    user_id
                }, {
                    transaction
                });
                await transaction.commit();
                return {
                    comment_id,
                    is_liked: true,
                    likes: commentLikesCount + 1
                };
            } else {
                await _database.DB.ArticleCommentsLikes.destroy({
                    where: {
                        comment_id: comment.pk,
                        user_id
                    },
                    force: true,
                    transaction
                });
                await transaction.commit();
                return {
                    comment_id,
                    is_liked: false,
                    likes: commentLikesCount - 1
                };
            }
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
};
CommentService = _ts_decorate([
    (0, _typedi.Service)()
], CommentService);

//# sourceMappingURL=comments.service.js.map