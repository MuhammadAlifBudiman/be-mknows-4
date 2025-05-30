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
    get ArticleCommentModel () {
        return ArticleCommentModel;
    },
    get default () {
        return _default;
    }
});
const _sequelize = require("sequelize");
const _usersmodel = require("./users.model");
const _filesmodel = require("./files.model");
const _articlesmodel = require("./articles.model");
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
let ArticleCommentModel = class ArticleCommentModel extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "pk", void 0), _define_property(this, "uuid", void 0), _define_property(this, "article_id", void 0), _define_property(this, "author_id", void 0), _define_property(this, "comment", void 0), _define_property(this, "article", void 0), _define_property(this, "author", void 0), _define_property(this, "replies", void 0), _define_property(this, "likes", void 0), _define_property(this, "created_at", void 0), _define_property(this, "updated_at", void 0), _define_property(this, "deleted_at", void 0);
    }
};
function _default(sequelize) {
    ArticleCommentModel.init({
        pk: {
            type: _sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        uuid: {
            type: _sequelize.DataTypes.UUID,
            defaultValue: _sequelize.DataTypes.UUIDV4
        },
        article_id: {
            allowNull: false,
            type: _sequelize.DataTypes.INTEGER
        },
        author_id: {
            allowNull: false,
            type: _sequelize.DataTypes.INTEGER
        },
        comment: {
            type: _sequelize.DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: "articles_comments",
        timestamps: true,
        paranoid: true,
        sequelize,
        defaultScope: {
            include: [
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
                        "uuid",
                        "title"
                    ],
                    model: _articlesmodel.ArticleModel,
                    as: "article"
                }
            ]
        }
    });
    _articlesmodel.ArticleModel.hasMany(ArticleCommentModel, {
        foreignKey: "article_id",
        as: "comments"
    });
    ArticleCommentModel.belongsTo(_articlesmodel.ArticleModel, {
        foreignKey: "article_id",
        as: "article"
    });
    ArticleCommentModel.belongsTo(_usersmodel.UserModel, {
        foreignKey: "author_id",
        as: "author"
    });
    return ArticleCommentModel;
}

//# sourceMappingURL=articles_comments.model.js.map