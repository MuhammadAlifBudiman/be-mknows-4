"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReplyRoute", {
    enumerable: true,
    get: function() {
        return ReplyRoute;
    }
});
const _authmiddleware = require("../middlewares/auth.middleware");
const _validationmiddleware = require("../middlewares/validation.middleware");
const _express = require("express");
const _replycontroller = require("../controllers/reply.controller");
const _repliesdto = require("../dtos/replies.dto");
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
let ReplyRoute = class ReplyRoute {
    initializeRoutes() {
        this.router.get(`/v1/${this.path}`, this.controller.getReplies);
        this.router.get(`/v1/${this.path}/:comment_id`, this.controller.getRepliesByComment);
        this.router.post(`/v1/${this.path}/:comment_id`, _authmiddleware.AuthMiddleware, (0, _validationmiddleware.ValidationMiddleware)(_repliesdto.CreateReplyDto), this.controller.createReply);
        this.router.put(`/v1/${this.path}/:reply_id`, _authmiddleware.AuthMiddleware, (0, _validationmiddleware.ValidationMiddleware)(_repliesdto.UpdateReplyDto), this.controller.updateReply);
        this.router.delete(`/v1/${this.path}/:reply_id`, _authmiddleware.AuthMiddleware, this.controller.deleteReply);
        this.router.post(`/v1/${this.path}/:reply_id/like`, _authmiddleware.AuthMiddleware, this.controller.likeReply);
    }
    constructor(){
        _define_property(this, "path", "replies");
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "controller", new _replycontroller.ReplyController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=replies.routes.js.map