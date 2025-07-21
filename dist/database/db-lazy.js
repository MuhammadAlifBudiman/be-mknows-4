"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getDB", {
    enumerable: true,
    get: function() {
        return getDB;
    }
});
const _sequelize = require("sequelize");
const _index = require("../config/index");
const _logger = require("../utils/logger");
const _database = /*#__PURE__*/ _interop_require_default(require("../config/database"));
const _otpsmodel = /*#__PURE__*/ _interop_require_default(require("../models/otps.model"));
const _rolesmodel = /*#__PURE__*/ _interop_require_default(require("../models/roles.model"));
const _filesmodel = /*#__PURE__*/ _interop_require_default(require("../models/files.model"));
const _usersmodel = /*#__PURE__*/ _interop_require_default(require("../models/users.model"));
const _users_rolesmodel = /*#__PURE__*/ _interop_require_default(require("../models/users_roles.model"));
const _users_sessionsmodel = /*#__PURE__*/ _interop_require_default(require("../models/users_sessions.model"));
const _categoriesmodel = /*#__PURE__*/ _interop_require_default(require("../models/categories.model"));
const _articlesmodel = /*#__PURE__*/ _interop_require_default(require("../models/articles.model"));
const _articles_categoriesmodel = /*#__PURE__*/ _interop_require_default(require("../models/articles_categories.model"));
const _articles_likesmodel = /*#__PURE__*/ _interop_require_default(require("../models/articles_likes.model"));
const _articles_commentsmodel = /*#__PURE__*/ _interop_require_default(require("../models/articles_comments.model"));
const _articles_repliesmodel = /*#__PURE__*/ _interop_require_default(require("../models/articles_replies.model"));
const _articles_comments_likemodel = /*#__PURE__*/ _interop_require_default(require("../models/articles_comments_like.model"));
const _articles_replies_likemodel = /*#__PURE__*/ _interop_require_default(require("../models/articles_replies_like.model"));
const _articles_bookmarkmodel = /*#__PURE__*/ _interop_require_default(require("../models/articles_bookmark.model"));
const _articles_viewsmodel = /*#__PURE__*/ _interop_require_default(require("../models/articles_views.model"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let DB = null;
let initializing = false;
let initialized = false;
async function getDB() {
    if (initialized) return DB;
    if (initializing) {
        while(!initialized){
            await new Promise((resolve)=>setTimeout(resolve, 50));
        }
        return DB;
    }
    initializing = true;
    const dbConfig = _database.default[_index.NODE_ENV] || _database.default["development"];
    const sequelize = new _sequelize.Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
    await sequelize.authenticate();
    _logger.logger.info(`=> Database Connected on ${_index.NODE_ENV}`);
    DB = {
        OTPs: (0, _otpsmodel.default)(sequelize),
        Files: (0, _filesmodel.default)(sequelize),
        Roles: (0, _rolesmodel.default)(sequelize),
        Users: (0, _usersmodel.default)(sequelize),
        UsersRoles: (0, _users_rolesmodel.default)(sequelize),
        UsersSessions: (0, _users_sessionsmodel.default)(sequelize),
        Categories: (0, _categoriesmodel.default)(sequelize),
        Articles: (0, _articlesmodel.default)(sequelize),
        ArticlesCategories: (0, _articles_categoriesmodel.default)(sequelize),
        ArticlesLikes: (0, _articles_likesmodel.default)(sequelize),
        ArticlesComments: (0, _articles_commentsmodel.default)(sequelize),
        CommentsReplies: (0, _articles_repliesmodel.default)(sequelize),
        ArticleCommentsLikes: (0, _articles_comments_likemodel.default)(sequelize),
        CommentsRepliesLikes: (0, _articles_replies_likemodel.default)(sequelize),
        ArticlesBookmarks: (0, _articles_bookmarkmodel.default)(sequelize),
        ArticlesViews: (0, _articles_viewsmodel.default)(sequelize),
        sequelize,
        Sequelize: _sequelize.Sequelize
    };
    initialized = true;
    return DB;
}

//# sourceMappingURL=db-lazy.js.map