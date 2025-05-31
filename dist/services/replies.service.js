"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReplyService", {
    enumerable: true,
    get: function() {
        return ReplyService;
    }
});
const _dblazy = require("../database/db-lazy");
const _HttpException = require("../exceptions/HttpException");
const _typedi = require("typedi");
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
let ReplyService = class ReplyService {
    replyParsed(reply) {
        var _reply_author_avatar;
        return {
            uuid: reply.uuid,
            reply: reply.reply,
            comment: {
                uuid: reply.comment.uuid,
                comment: reply.comment.comment
            },
            author: {
                uuid: reply.author.uuid,
                full_name: reply.author.full_name || null,
                avatar: ((_reply_author_avatar = reply.author.avatar) === null || _reply_author_avatar === void 0 ? void 0 : _reply_author_avatar.uuid) || null
            },
            likes: reply.likes || 0
        };
    }
    async getReplies() {
        const DB = await (0, _dblazy.getDB)();
        const reply = await DB.CommentsReplies.findAll({});
        const likeCountPromises = reply.map((reply)=>{
            return DB.CommentsRepliesLikes.count({
                where: {
                    reply_id: reply.pk
                }
            });
        });
        const likesCount = await Promise.all(likeCountPromises);
        reply.forEach((reply, index)=>{
            reply.likes = likesCount[index];
        });
        const transformedReplies = reply.map((reply)=>this.replyParsed(reply));
        return {
            replies: transformedReplies
        };
    }
    async getRepliesByComment(comment_id) {
        const DB = await (0, _dblazy.getDB)();
        const comment = await DB.ArticlesComments.findOne({
            where: {
                uuid: comment_id
            },
            attributes: [
                "pk"
            ]
        });
        if (!comment) {
            throw new _HttpException.HttpException(false, 404, "Comment is not found");
        }
        const replies = await DB.CommentsReplies.findAll({
            where: {
                comment_id: comment.pk
            }
        });
        if (!replies) {
            throw new _HttpException.HttpException(false, 404, "Reply is not found");
        }
        const likeCountPromises = replies.map((reply)=>{
            return DB.CommentsRepliesLikes.count({
                where: {
                    reply_id: reply.pk
                }
            });
        });
        const likesCount = await Promise.all(likeCountPromises);
        replies.forEach((reply, index)=>{
            reply.likes = likesCount[index];
        });
        const transformedReplies = replies.map((reply)=>this.replyParsed(reply));
        return {
            replies: transformedReplies
        };
    }
    async getReplyById(reply_id) {
        const DB = await (0, _dblazy.getDB)();
        const reply = await DB.CommentsReplies.findOne({
            where: {
                uuid: reply_id
            }
        });
        if (!reply) {
            throw new _HttpException.HttpException(false, 400, "Reply is not found");
        }
        const likeCount = await DB.CommentsRepliesLikes.count({
            where: {
                reply_id: reply.pk
            }
        });
        reply.likes = likeCount;
        const response = this.replyParsed(reply);
        return response;
    }
    async createReply(comment_id, author_id, data) {
        const DB = await (0, _dblazy.getDB)();
        const comment = await DB.ArticlesComments.findOne({
            where: {
                uuid: comment_id
            },
            attributes: [
                "pk"
            ]
        });
        const reply = await DB.CommentsReplies.create(_object_spread({
            comment_id: comment.pk,
            author_id
        }, data));
        delete reply.dataValues.pk;
        return this.getReplyById(reply.uuid);
    }
    async updateReply(reply_id, data) {
        const DB = await (0, _dblazy.getDB)();
        const updatedData = {};
        if (data.reply) updatedData.reply = data.reply;
        if (Object.keys(updatedData).length === 0) {
            throw new _HttpException.HttpException(false, 400, "Some field is required");
        }
        if (Object.keys(updatedData).length > 0) {
            await DB.CommentsReplies.update(updatedData, {
                where: {
                    uuid: reply_id
                },
                returning: true
            });
        }
        return this.getReplyById(reply_id);
    }
    async deleteReply(reply_id) {
        const DB = await (0, _dblazy.getDB)();
        const reply = await DB.CommentsReplies.findOne({
            where: {
                uuid: reply_id
            }
        });
        if (!reply) {
            throw new _HttpException.HttpException(false, 400, "Reply is not found");
        }
        const transaction = await DB.sequelize.transaction();
        try {
            await reply.destroy({
                transaction
            });
            await Promise.all([
                DB.CommentsRepliesLikes.destroy({
                    where: {
                        reply_id: reply.pk
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
    async likeReply(reply_id, user_id) {
        const DB = await (0, _dblazy.getDB)();
        const reply = await DB.CommentsReplies.findOne({
            where: {
                uuid: reply_id
            }
        });
        if (!reply) {
            throw new _HttpException.HttpException(false, 400, "Reply is not found");
        }
        const transaction = await DB.sequelize.transaction();
        try {
            const [replyLike, replyLikeCount] = await Promise.all([
                DB.CommentsRepliesLikes.findOne({
                    where: {
                        reply_id: reply.pk,
                        user_id
                    },
                    transaction
                }),
                DB.CommentsRepliesLikes.count({
                    where: {
                        reply_id: reply.pk,
                        user_id
                    },
                    transaction
                })
            ]);
            if (!replyLike) {
                await DB.CommentsRepliesLikes.create({
                    reply_id: reply.pk,
                    user_id
                }, {
                    transaction
                });
                await transaction.commit();
                return {
                    reply_id,
                    is_liked: true,
                    likes: replyLikeCount + 1
                };
            } else {
                await DB.CommentsRepliesLikes.destroy({
                    where: {
                        reply_id: reply.pk,
                        user_id
                    },
                    force: true,
                    transaction
                });
                await transaction.commit();
                return {
                    reply_id,
                    is_liked: false,
                    likes: replyLikeCount - 1
                };
            }
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
};
ReplyService = _ts_decorate([
    (0, _typedi.Service)()
], ReplyService);

//# sourceMappingURL=replies.service.js.map