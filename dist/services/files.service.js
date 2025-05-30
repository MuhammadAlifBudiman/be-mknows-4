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
const _database = require("../database");
const _HttpException = require("../exceptions/HttpException");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FileService = class FileService {
    async uploadSingleFile(user_id, file) {
        const fileUpload = await _database.DB.Files.create({
            user_id,
            name: file.filename,
            type: file.mimetype,
            size: file.size,
            url: file.location || null
        });
        delete fileUpload.dataValues.pk;
        delete fileUpload.dataValues.name;
        delete fileUpload.dataValues.user_id;
        return fileUpload;
    }
    async getFileWithUUID(file_uuid) {
        const file = await _database.DB.Files.findOne({
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
        const files = await _database.DB.Files.findAll({
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