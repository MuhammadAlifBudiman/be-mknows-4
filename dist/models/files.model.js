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
    get FileModel () {
        return FileModel;
    },
    get default () {
        return _default;
    }
});
const _sequelize = require("sequelize");
let FileModel = class FileModel extends _sequelize.Model {
};
function _default(sequelize) {
    FileModel.init({
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
        name: {
            type: _sequelize.DataTypes.STRING,
            allowNull: false
        },
        size: {
            type: _sequelize.DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: _sequelize.DataTypes.STRING,
            allowNull: false
        },
        url: {
            type: _sequelize.DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: "files",
        timestamps: true,
        paranoid: true,
        sequelize
    });
    return FileModel;
}

//# sourceMappingURL=files.model.js.map