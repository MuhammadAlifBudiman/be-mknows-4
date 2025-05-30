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
let RoleModel = class RoleModel extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "pk", void 0), _define_property(this, "uuid", void 0), _define_property(this, "name", void 0), _define_property(this, "created_at", void 0), _define_property(this, "updated_at", void 0), _define_property(this, "deleted_at", void 0);
    }
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