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
let OTPModel = class OTPModel extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "pk", void 0), _define_property(this, "uuid", void 0), _define_property(this, "user_id", void 0), _define_property(this, "key", void 0), _define_property(this, "type", void 0), _define_property(this, "status", void 0), _define_property(this, "expired_at", void 0), _define_property(this, "created_at", void 0), _define_property(this, "updated_at", void 0), _define_property(this, "deleted_at", void 0);
    }
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