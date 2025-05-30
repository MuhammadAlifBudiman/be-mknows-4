"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "app", {
    enumerable: true,
    get: function() {
        return app;
    }
});
const _app = require("./app");
const _validateEnv = require("./utils/validateEnv");
const _authroutes = require("./routes/auth.routes");
const _usersroutes = require("./routes/users.routes");
const _accountroutes = require("./routes/account.routes");
const _filesroutes = require("./routes/files.routes");
const _categoriesroutes = require("./routes/categories.routes");
const _articlesroutes = require("./routes/articles.routes");
const _commentsroutes = require("./routes/comments.routes");
const _repliesroutes = require("./routes/replies.routes");
(0, _validateEnv.ValidateEnv)();
const app = new _app.App([
    new _authroutes.AuthRoute(),
    new _usersroutes.UserRoute(),
    new _accountroutes.AccountRoute(),
    new _filesroutes.FileRoute(),
    new _categoriesroutes.CategoryRoute(),
    new _articlesroutes.ArticleRoute(),
    new _commentsroutes.CommentRoute(),
    new _repliesroutes.ReplyRoute()
]);
app.listen();

//# sourceMappingURL=server.js.map