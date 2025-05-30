"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ArticleRoute", {
    enumerable: true,
    get: function() {
        return ArticleRoute;
    }
});
const _express = require("express");
const _articlecontroller = require("../controllers/article.controller");
const _authmiddleware = require("../middlewares/auth.middleware");
const _validationmiddleware = require("../middlewares/validation.middleware");
const _articlesdto = require("../dtos/articles.dto");
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
let ArticleRoute = class ArticleRoute {
    initializeRoutes() {
        this.router.get(`/v1/${this.path}/categories/:category_id`, this.article.getArticlesByCategory);
        this.router.get(`/v1/${this.path}`, this.article.getArticles);
        this.router.get(`/v1/${this.path}/popular`, this.article.getPopularArticles);
        this.router.get(`/v1/${this.path}/:article_id`, _authmiddleware.AuthMiddleware, this.article.getArticle);
        this.router.post(`/v1/${this.path}/:article_id/like`, _authmiddleware.AuthMiddleware, this.article.likeArticle);
        this.router.post(`/v1/${this.path}`, _authmiddleware.AuthMiddleware, (0, _validationmiddleware.ValidationMiddleware)(_articlesdto.CreateArticleDto), this.article.createArticle);
        this.router.put(`/v1/${this.path}/:article_id`, _authmiddleware.AuthMiddleware, (0, _validationmiddleware.ValidationMiddleware)(_articlesdto.UpdateArticleDto), this.article.updateArticle);
        this.router.delete(`/v1/${this.path}/:article_id`, _authmiddleware.AuthMiddleware, this.article.deleteArticle);
        this.router.post(`/v1/${this.path}/:article_id/bookmark`, _authmiddleware.AuthMiddleware, this.article.bookmarkArticle);
        this.router.get(`/v1/${this.path}/bookmark/me`, _authmiddleware.AuthMiddleware, this.article.getBookmarkByMe);
    }
    constructor(){
        _define_property(this, "path", "articles");
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "article", new _articlecontroller.ArticleController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=articles.routes.js.map