"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ArticleBookmarkModel () {
        return ArticleBookmarkModel;
    },
    get default () {
        return _default;
    }
});
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
let ArticleBookmarkModel = class ArticleBookmarkModel extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "article_id", void 0), _define_property(this, "user_id", void 0), _define_property(this, "created_at", void 0), _define_property(this, "updated_at", void 0), _define_property(this, "deleted_at", void 0);
    }
};
function _default(sequelize) {
    ArticleBookmarkModel.init({
        article_id: {
            allowNull: false,
            type: _sequelize.DataTypes.INTEGER
        },
        user_id: {
            allowNull: false,
            type: _sequelize.DataTypes.INTEGER
        }
    }, {
        tableName: "articles_bookmarks",
        timestamps: true,
        paranoid: true,
        sequelize
    });
    return ArticleBookmarkModel;
}

//# sourceMappingURL=articles_bookmark.model.js.map