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
    get UserSessionModel () {
        return UserSessionModel;
    },
    get default () {
        return _default;
    }
});
const _sequelize = require("sequelize");
const _usersmodel = require("./users.model");
let UserSessionModel = class UserSessionModel extends _sequelize.Model {
};
function _default(sequelize) {
    UserSessionModel.init({
        pk: {
            autoIncrement: true,
            primaryKey: true,
            type: _sequelize.DataTypes.INTEGER
        },
        uuid: {
            allowNull: true,
            defaultValue: _sequelize.DataTypes.UUIDV4,
            type: _sequelize.DataTypes.STRING(52)
        },
        user_id: {
            allowNull: false,
            type: _sequelize.DataTypes.INTEGER()
        },
        useragent: {
            allowNull: false,
            type: _sequelize.DataTypes.STRING(320)
        },
        ip_address: {
            allowNull: false,
            type: _sequelize.DataTypes.STRING(64)
        },
        status: {
            allowNull: false,
            type: _sequelize.DataTypes.STRING(512)
        }
    }, {
        tableName: "users_sessions",
        timestamps: true,
        paranoid: true,
        sequelize
    });
    UserSessionModel.belongsTo(_usersmodel.UserModel, {
        foreignKey: "user_id",
        as: "user"
    });
    return UserSessionModel;
}

//# sourceMappingURL=users_sessions.model.js.map