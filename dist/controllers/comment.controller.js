"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CommentController", {
    enumerable: true,
    get: function() {
        return CommentController;
    }
});
const _commentsservice = require("../services/comments.service");
const _apiResponse = require("../utils/apiResponse");
const _typedi = require("typedi");
const _expressasynchandler = /*#__PURE__*/ _interop_require_default(require("express-async-handler"));
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let CommentController = class CommentController {
    constructor(){
        _define_property(this, "comment", _typedi.Container.get(_commentsservice.CommentService));
        _define_property(this, "getComments", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const response = await this.comment.getComments();
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Get Comment Success", response.comments));
        }));
        _define_property(this, "getCommentsByArticle", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const { article_id } = req.params;
            const response = await this.comment.getCommentsByArticle(article_id);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Get Comment Success", response.comments));
        }));
        _define_property(this, "createComment", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const { article_id } = req.params;
            const author_id = req.user.pk;
            const data = req.body;
            const response = await this.comment.createComment(article_id, author_id, data);
            res.status(201).json((0, _apiResponse.apiResponse)(200, "OK", "Create Comment Success", response));
        }));
        _define_property(this, "updateComment", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const { comment_id } = req.params;
            const data = req.body;
            const response = await this.comment.updateComment(comment_id, data);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Update Comment Success", response));
        }));
        _define_property(this, "deleteComment", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const { comment_id } = req.params;
            const response = await this.comment.deleteComment(comment_id);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Delete Comment Success", {}));
        }));
        _define_property(this, "likeComment", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const { comment_id } = req.params;
            const user_id = req.user.pk;
            const response = await this.comment.likeComment(comment_id, user_id);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Like Comment Success", response));
        }));
    }
};

//# sourceMappingURL=comment.controller.js.map