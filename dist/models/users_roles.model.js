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
    get UserRoleModel () {
        return UserRoleModel;
    },
    get default () {
        return _default;
    }
});
const _sequelize = require("sequelize");
const _rolesmodel = require("./roles.model");
const _usersmodel = require("./users.model");
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
let UserRoleModel = class UserRoleModel extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "user_id", void 0), _define_property(this, "role_id", void 0), _define_property(this, "role", void 0), _define_property(this, "created_at", void 0), _define_property(this, "updated_at", void 0), _define_property(this, "deleted_at", void 0);
    }
};
function _default(sequelize) {
    UserRoleModel.init({
        user_id: {
            allowNull: false,
            type: _sequelize.DataTypes.INTEGER
        },
        role_id: {
            allowNull: false,
            type: _sequelize.DataTypes.INTEGER
        }
    }, {
        tableName: "users_roles",
        timestamps: true,
        paranoid: true,
        sequelize
    });
    _usersmodel.UserModel.belongsToMany(_rolesmodel.RoleModel, {
        through: UserRoleModel,
        foreignKey: "user_id"
    });
    _rolesmodel.RoleModel.belongsToMany(_usersmodel.UserModel, {
        through: UserRoleModel,
        foreignKey: "role_id"
    });
    _usersmodel.UserModel.hasMany(UserRoleModel);
    UserRoleModel.belongsTo(_usersmodel.UserModel);
    _rolesmodel.RoleModel.hasMany(UserRoleModel);
    UserRoleModel.belongsTo(_rolesmodel.RoleModel, {
        foreignKey: "role_id",
        as: "role"
    });
    return UserRoleModel;
}

//# sourceMappingURL=users_roles.model.js.map