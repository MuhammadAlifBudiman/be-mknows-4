"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileService", {
    enumerable: true,
    get: function() {
        return FileService;
    }
});
const _typedi = require("typedi");
const _dblazy = require("../database/db-lazy");
const _HttpException = require("../exceptions/HttpException");
const _index = require("../config/index");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FileService = class FileService {
    async uploadSingleFile(user_id, file) {
        const DB = await (0, _dblazy.getDB)();
        const isProduction = _index.NODE_ENV === 'production';
        const fileUrl = isProduction ? file.location || null : `/uploads/${file.filename}`;
        const fileName = isProduction ? file.originalname : file.filename;
        const fileData = {
            user_id,
            name: fileName,
            type: file.mimetype,
            size: file.size,
            url: fileUrl
        };
        const fileUpload = await DB.Files.create(fileData);
        delete fileUpload.dataValues.pk;
        delete fileUpload.dataValues.name;
        delete fileUpload.dataValues.user_id;
        return fileUpload;
    }
    async getFileWithUUID(file_uuid) {
        const DB = await (0, _dblazy.getDB)();
        const file = await DB.Files.findOne({
            attributes: [
                "name",
                "url"
            ],
            where: {
                uuid: file_uuid
            }
        });
        if (!file) throw new _HttpException.HttpException(false, 400, "File is not found");
        return file;
    }
    async getUserFiles(user_id) {
        const DB = await (0, _dblazy.getDB)();
        const files = await DB.Files.findAll({
            attributes: {
                exclude: [
                    "pk",
                    "user_id",
                    "name"
                ]
            },
            where: {
                user_id
            }
        });
        return files;
    }
};
FileService = _ts_decorate([
    (0, _typedi.Service)()
], FileService);

//# sourceMappingURL=files.service.js.map