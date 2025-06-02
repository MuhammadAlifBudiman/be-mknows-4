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
    get RoleModel () {
        return RoleModel;
    },
    get default () {
        return _default;
    }
});
const _sequelize = require("sequelize");
let RoleModel = class RoleModel extends _sequelize.Model {
};
function _default(sequelize) {
    RoleModel.init({
        pk: {
            autoIncrement: true,
            primaryKey: true,
            type: _sequelize.DataTypes.INTEGER
        },
        uuid: {
            allowNull: true,
            defaultValue: _sequelize.DataTypes.UUIDV4,
            type: _sequelize.DataTypes.STRING(52),
            unique: true
        },
        name: {
            allowNull: true,
            type: _sequelize.DataTypes.STRING(52),
            unique: true
        }
    }, {
        tableName: "roles",
        timestamps: true,
        paranoid: true,
        sequelize
    });
    return RoleModel;
}

//# sourceMappingURL=roles.model.js.map