"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CommentRoute", {
    enumerable: true,
    get: function() {
        return CommentRoute;
    }
});
const _commentcontroller = require("../controllers/comment.controller");
const _commentsdto = require("../dtos/comments.dto");
const _authmiddleware = require("../middlewares/auth.middleware");
const _validationmiddleware = require("../middlewares/validation.middleware");
const _express = require("express");
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
let CommentRoute = class CommentRoute {
    initializeRoutes() {
        this.router.get(`/v1/${this.path}`, this.controller.getComments);
        this.router.get(`/v1/${this.path}/:article_id`, this.controller.getCommentsByArticle);
        this.router.post(`/v1/${this.path}/:article_id`, _authmiddleware.AuthMiddleware, (0, _validationmiddleware.ValidationMiddleware)(_commentsdto.CreateCommentDto), this.controller.createComment);
        this.router.put(`/v1/${this.path}/:comment_id`, _authmiddleware.AuthMiddleware, (0, _validationmiddleware.ValidationMiddleware)(_commentsdto.UpdateCommentDto), this.controller.updateComment);
        this.router.delete(`/v1/${this.path}/:comment_id`, _authmiddleware.AuthMiddleware, this.controller.deleteComment);
        this.router.post(`/v1/${this.path}/:comment_id/like`, _authmiddleware.AuthMiddleware, this.controller.likeComment);
    }
    constructor(){
        _define_property(this, "path", "comments");
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "controller", new _commentcontroller.CommentController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=comments.routes.js.map