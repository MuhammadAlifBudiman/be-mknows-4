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
    get OTPModel () {
        return OTPModel;
    },
    get default () {
        return _default;
    }
});
const _sequelize = require("sequelize");
let OTPModel = class OTPModel extends _sequelize.Model {
};
function _default(sequelize) {
    OTPModel.init({
        pk: {
            type: _sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        uuid: {
            type: _sequelize.DataTypes.UUID,
            defaultValue: _sequelize.DataTypes.UUIDV4
        },
        user_id: {
            type: _sequelize.DataTypes.INTEGER,
            allowNull: false
        },
        key: {
            type: _sequelize.DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: _sequelize.DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: _sequelize.DataTypes.STRING,
            allowNull: false
        },
        expired_at: {
            type: _sequelize.DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: "otps",
        timestamps: true,
        paranoid: true,
        sequelize
    });
    return OTPModel;
}

//# sourceMappingURL=otps.model.js.map