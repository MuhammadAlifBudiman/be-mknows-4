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
    get CommentReplyModel () {
        return CommentReplyModel;
    },
    get default () {
        return _default;
    }
});
const _sequelize = require("sequelize");
const _articles_commentsmodel = require("./articles_comments.model");
const _usersmodel = require("./users.model");
const _filesmodel = require("./files.model");
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
let CommentReplyModel = class CommentReplyModel extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "pk", void 0), _define_property(this, "uuid", void 0), _define_property(this, "comment_id", void 0), _define_property(this, "author_id", void 0), _define_property(this, "reply", void 0), _define_property(this, "author", void 0), _define_property(this, "comment", void 0), _define_property(this, "likes", void 0), _define_property(this, "created_at", void 0), _define_property(this, "updated_at", void 0), _define_property(this, "deleted_at", void 0);
    }
};
function _default(sequelize) {
    CommentReplyModel.init({
        pk: {
            type: _sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        uuid: {
            type: _sequelize.DataTypes.UUID,
            defaultValue: _sequelize.DataTypes.UUIDV4
        },
        comment_id: {
            allowNull: false,
            type: _sequelize.DataTypes.INTEGER
        },
        author_id: {
            allowNull: false,
            type: _sequelize.DataTypes.INTEGER
        },
        reply: {
            type: _sequelize.DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: "articles_replies",
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
                        "comment"
                    ],
                    model: _articles_commentsmodel.ArticleCommentModel,
                    as: "comment"
                }
            ]
        }
    });
    _articles_commentsmodel.ArticleCommentModel.hasMany(CommentReplyModel, {
        foreignKey: "comment_id",
        as: "replies"
    });
    CommentReplyModel.belongsTo(_articles_commentsmodel.ArticleCommentModel, {
        foreignKey: "comment_id",
        as: "comment"
    });
    CommentReplyModel.belongsTo(_usersmodel.UserModel, {
        foreignKey: "author_id",
        as: "author"
    });
    return CommentReplyModel;
}

//# sourceMappingURL=articles_replies.model.js.map