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
    get CategoryModel () {
        return CategoryModel;
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
let CategoryModel = class CategoryModel extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "pk", void 0), _define_property(this, "uuid", void 0), _define_property(this, "name", void 0), _define_property(this, "description", void 0), _define_property(this, "created_at", void 0), _define_property(this, "updated_at", void 0), _define_property(this, "deleted_at", void 0);
    }
};
function _default(sequelize) {
    CategoryModel.init({
        pk: {
            type: _sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        uuid: {
            type: _sequelize.DataTypes.UUID,
            defaultValue: _sequelize.DataTypes.UUIDV4
        },
        name: {
            type: _sequelize.DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: _sequelize.DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: "categories",
        timestamps: true,
        paranoid: true,
        sequelize
    });
    return CategoryModel;
}

//# sourceMappingURL=categories.model.js.map