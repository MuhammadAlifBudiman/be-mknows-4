"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReplyController", {
    enumerable: true,
    get: function() {
        return ReplyController;
    }
});
const _apiResponse = require("../utils/apiResponse");
const _typedi = require("typedi");
const _repliesservice = require("../services/replies.service");
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
let ReplyController = class ReplyController {
    constructor(){
        _define_property(this, "reply", _typedi.Container.get(_repliesservice.ReplyService));
        _define_property(this, "getReplies", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const response = await this.reply.getReplies();
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Get Reply Success", response.replies));
        }));
        _define_property(this, "getRepliesByComment", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const { comment_id } = req.params;
            const response = await this.reply.getRepliesByComment(comment_id);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Get Reply Success", response.replies));
        }));
        _define_property(this, "createReply", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const { comment_id } = req.params;
            const author_id = req.user.pk;
            const data = req.body;
            const response = await this.reply.createReply(comment_id, author_id, data);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Create Reply Success", response));
        }));
        _define_property(this, "updateReply", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const { reply_id } = req.params;
            const data = req.body;
            const response = await this.reply.updateReply(reply_id, data);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Update Reply Success", response));
        }));
        _define_property(this, "deleteReply", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const { reply_id } = req.params;
            const response = await this.reply.deleteReply(reply_id);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Delete Reply Success", response));
        }));
        _define_property(this, "likeReply", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const { reply_id } = req.params;
            const user_id = req.user.pk;
            const response = await this.reply.likeReply(reply_id, user_id);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Like Reply Success", response));
        }));
    }
};

//# sourceMappingURL=reply.controller.js.map