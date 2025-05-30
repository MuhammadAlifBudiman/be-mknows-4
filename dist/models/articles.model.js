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
    get ArticleModel () {
        return ArticleModel;
    },
    get default () {
        return _default;
    }
});
const _sequelize = require("sequelize");
const _usersmodel = require("./users.model");
const _filesmodel = require("./files.model");
const _categoriesmodel = require("./categories.model");
const _articles_categoriesmodel = require("./articles_categories.model");
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
let ArticleModel = class ArticleModel extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "pk", void 0), _define_property(this, "uuid", void 0), _define_property(this, "title", void 0), _define_property(this, "description", void 0), _define_property(this, "content", void 0), _define_property(this, "thumbnail_id", void 0), _define_property(this, "author_id", void 0), _define_property(this, "thumbnail", void 0), _define_property(this, "author", void 0), _define_property(this, "categories", void 0), _define_property(this, "views", void 0), _define_property(this, "likes", void 0), _define_property(this, "comments", void 0), _define_property(this, "bookmarks", void 0), _define_property(this, "created_at", void 0), _define_property(this, "updated_at", void 0), _define_property(this, "deleted_at", void 0);
    }
};
function _default(sequelize) {
    ArticleModel.init({
        pk: {
            type: _sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        uuid: {
            type: _sequelize.DataTypes.UUID,
            defaultValue: _sequelize.DataTypes.UUIDV4
        },
        title: {
            type: _sequelize.DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: _sequelize.DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: _sequelize.DataTypes.TEXT,
            allowNull: false
        },
        thumbnail_id: {
            type: _sequelize.DataTypes.INTEGER,
            allowNull: false
        },
        author_id: {
            type: _sequelize.DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: "articles",
        timestamps: true,
        paranoid: true,
        sequelize,
        defaultScope: {
            include: [
                {
                    attributes: [
                        "uuid"
                    ],
                    model: _filesmodel.FileModel,
                    as: "thumbnail"
                },
                {
                    attributes: [
                        "uuid",
                        "full_name",
                        "display_picture"
                    ],
                    model: _usersmodel.UserModel,
                    as: "author",
                    include: [
                        {
                            attributes: [
                                "uuid"
                            ],
                            model: _filesmodel.FileModel,
                            as: "avatar"
                        }
                    ]
                },
                {
                    attributes: [
                        "category_id"
                    ],
                    model: _articles_categoriesmodel.ArticleCategoryModel,
                    as: "categories",
                    include: [
                        {
                            attributes: [
                                "uuid",
                                "name",
                                "description"
                            ],
                            model: _categoriesmodel.CategoryModel,
                            as: "category"
                        }
                    ]
                }
            ]
        }
    });
    _filesmodel.FileModel.hasOne(ArticleModel, {
        foreignKey: "thumbnail_id",
        as: "thumbnail"
    });
    ArticleModel.belongsTo(_filesmodel.FileModel, {
        foreignKey: "thumbnail_id",
        as: "thumbnail"
    });
    _usersmodel.UserModel.hasMany(ArticleModel, {
        foreignKey: "author_id",
        as: "author"
    });
    ArticleModel.belongsTo(_usersmodel.UserModel, {
        foreignKey: "author_id",
        as: "author"
    });
    return ArticleModel;
}

//# sourceMappingURL=articles.model.js.map