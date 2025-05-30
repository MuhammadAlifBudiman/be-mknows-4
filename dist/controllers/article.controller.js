"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ArticleController", {
    enumerable: true,
    get: function() {
        return ArticleController;
    }
});
const _expressasynchandler = /*#__PURE__*/ _interop_require_default(require("express-async-handler"));
const _typedi = require("typedi");
const _articlesservice = require("../services/articles.service");
const _apiResponse = require("../utils/apiResponse");
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
let ArticleController = class ArticleController {
    constructor(){
        _define_property(this, "article", _typedi.Container.get(_articlesservice.ArticleService));
        _define_property(this, "getArticles", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const query = req.query;
            const response = await this.article.getArticles(query);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Get Articles Success", response.articles, response.pagination));
        }));
        _define_property(this, "getArticlesByCategory", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const { category_id } = req.params;
            const query = req.query;
            const response = await this.article.getArticlesByCategory(query, category_id);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Get Articles Success", response.articles));
        }));
        _define_property(this, "getArticle", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const { article_id } = req.params;
            const user_id = req.user.pk;
            this.article.addView(article_id, user_id);
            const response = await this.article.getArticleById(article_id);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Get Article Success", response));
        }));
        _define_property(this, "createArticle", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const user_id = req.user.pk;
            const data = req.body;
            const response = await this.article.createArticle(user_id, data);
            res.status(201).json((0, _apiResponse.apiResponse)(201, "OK", "Create Article Success", response));
        }));
        _define_property(this, "updateArticle", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const { article_id } = req.params;
            const user_id = req.user.pk;
            const data = req.body;
            const response = await this.article.updateArticle(article_id, user_id, data);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Update Article Success", response));
        }));
        _define_property(this, "deleteArticle", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const { article_id } = req.params;
            const user_id = req.user.pk;
            await this.article.deleteArticle(article_id, user_id);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Delete Article Success", {}));
        }));
        _define_property(this, "likeArticle", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const { article_id } = req.params;
            const user_id = req.user.pk;
            const response = await this.article.likeArticle(user_id, article_id);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Like Article Success", response));
        }));
        _define_property(this, "bookmarkArticle", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const { article_id } = req.params;
            const user_id = req.user.pk;
            const response = await this.article.bookmarkArticle(user_id, article_id);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Bookmark Article Success", response));
        }));
        _define_property(this, "getBookmarkByMe", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const user_id = req.user.pk;
            const response = await this.article.getBookmarkByMe(user_id);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Get Bookmark Success", response.articles));
        }));
        _define_property(this, "getPopularArticles", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const query = req.query;
            const response = await this.article.getPopularArticles(query);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Get Popular Articles Success", response.articles));
        }));
    }
};

//# sourceMappingURL=article.controller.js.map