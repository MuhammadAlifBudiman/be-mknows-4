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
    get UserModel () {
        return UserModel;
    },
    get default () {
        return _default;
    }
});
const _sequelize = require("sequelize");
const _filesmodel = require("./files.model");
let UserModel = class UserModel extends _sequelize.Model {
};
function _default(sequelize) {
    UserModel.init({
        pk: {
            type: _sequelize.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        uuid: {
            type: _sequelize.DataTypes.UUID,
            defaultValue: _sequelize.DataTypes.UUIDV4
        },
        full_name: {
            type: _sequelize.DataTypes.STRING,
            allowNull: true
        },
        display_picture: {
            type: _sequelize.DataTypes.INTEGER,
            allowNull: true
        },
        email: {
            allowNull: false,
            type: _sequelize.DataTypes.STRING
        },
        password: {
            allowNull: false,
            type: _sequelize.DataTypes.TEXT
        },
        email_verified_at: {
            type: _sequelize.DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: "users",
        timestamps: true,
        paranoid: true,
        sequelize,
        defaultScope: {
            attributes: {
                exclude: [
                    "password"
                ]
            }
        }
    });
    _filesmodel.FileModel.hasOne(UserModel, {
        foreignKey: "display_picture",
        as: "avatar"
    });
    UserModel.belongsTo(_filesmodel.FileModel, {
        foreignKey: "display_picture",
        as: "avatar"
    });
    return UserModel;
}

//# sourceMappingURL=users.model.js.map