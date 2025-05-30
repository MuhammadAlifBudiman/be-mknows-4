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
let UserModel = class UserModel extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "pk", void 0), _define_property(this, "uuid", void 0), _define_property(this, "full_name", void 0), _define_property(this, "display_picture", void 0), _define_property(this, "email", void 0), _define_property(this, "password", void 0), _define_property(this, "email_verified_at", void 0), _define_property(this, "created_at", void 0), _define_property(this, "updated_at", void 0), _define_property(this, "deleted_at", void 0);
    }
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