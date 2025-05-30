"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileController", {
    enumerable: true,
    get: function() {
        return FileController;
    }
});
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _expressasynchandler = /*#__PURE__*/ _interop_require_default(require("express-async-handler"));
const _typedi = require("typedi");
const _filesservice = require("../services/files.service");
const _apiResponse = require("../utils/apiResponse");
const _HttpException = require("../exceptions/HttpException");
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let FileController = class FileController {
    constructor(){
        _define_property(this, "file", _typedi.Container.get(_filesservice.FileService));
        _define_property(this, "uploadFile", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const image = req.file;
            const user_id = req.user.pk;
            if (!image) throw new _HttpException.HttpException(false, 400, "File is required");
            const response = await this.file.uploadSingleFile(user_id, image);
            res.status(201).json((0, _apiResponse.apiResponse)(201, "OK", "Upload Success", response));
        }));
        _define_property(this, "getFileWithUUID", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const { file_id } = req.params;
            const file = await this.file.getFileWithUUID(file_id);
            const filepath = _path.default.join(process.cwd(), `./uploads/${file.name}`);
            if (!file || !_fs.default.existsSync(filepath)) {
                throw new _HttpException.HttpException(false, 400, "File is not found");
            }
            res.sendFile(filepath);
        }));
        _define_property(this, "getFileMine", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const user_id = req.user.pk;
            const response = await this.file.getUserFiles(user_id);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Get Files Success", response));
        }));
    }
};

//# sourceMappingURL=file.controller.js.map