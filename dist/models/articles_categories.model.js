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
    get ArticleCategoryModel () {
        return ArticleCategoryModel;
    },
    get default () {
        return _default;
    }
});
const _sequelize = require("sequelize");
const _articlesmodel = require("./articles.model");
const _categoriesmodel = require("./categories.model");
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
let ArticleCategoryModel = class ArticleCategoryModel extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "article_id", void 0), _define_property(this, "category_id", void 0), _define_property(this, "created_at", void 0), _define_property(this, "updated_at", void 0), _define_property(this, "deleted_at", void 0);
    }
};
function _default(sequelize) {
    ArticleCategoryModel.init({
        article_id: {
            allowNull: false,
            type: _sequelize.DataTypes.INTEGER
        },
        category_id: {
            allowNull: false,
            type: _sequelize.DataTypes.INTEGER
        }
    }, {
        tableName: "articles_categories",
        timestamps: true,
        paranoid: true,
        sequelize
    });
    _articlesmodel.ArticleModel.belongsToMany(_categoriesmodel.CategoryModel, {
        through: ArticleCategoryModel,
        foreignKey: "article_id"
    });
    _categoriesmodel.CategoryModel.belongsToMany(_articlesmodel.ArticleModel, {
        through: ArticleCategoryModel,
        foreignKey: "category_id"
    });
    _articlesmodel.ArticleModel.hasMany(ArticleCategoryModel, {
        foreignKey: "article_id",
        as: "categories"
    });
    ArticleCategoryModel.belongsTo(_articlesmodel.ArticleModel, {
        foreignKey: "article_id",
        as: "article"
    });
    _categoriesmodel.CategoryModel.hasMany(ArticleCategoryModel, {
        foreignKey: "category_id",
        as: "category"
    });
    ArticleCategoryModel.belongsTo(_categoriesmodel.CategoryModel, {
        foreignKey: "category_id",
        as: "category"
    });
    return ArticleCategoryModel;
}

//# sourceMappingURL=articles_categories.model.js.map