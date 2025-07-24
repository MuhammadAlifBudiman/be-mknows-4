"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileRoute", {
    enumerable: true,
    get: function() {
        return FileRoute;
    }
});
const _express = require("express");
const _filecontroller = require("../controllers/file.controller");
const _authmiddleware = require("../middlewares/auth.middleware");
const _fileuploadermiddleware = require("../middlewares/file-uploader.middleware");
const _index = require("../config/index");
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
let FileRoute = class FileRoute {
    initializeRoutes() {
        const uploadMiddlewares = _index.NODE_ENV === "production" ? [
            _authmiddleware.AuthMiddleware,
            _fileuploadermiddleware.uploadFile.single("file"),
            _fileuploadermiddleware.uploadToS3
        ] : [
            _authmiddleware.AuthMiddleware,
            _fileuploadermiddleware.uploadFile.single("file")
        ];
        this.router.post(`/v1/${this.path}/upload`, ...uploadMiddlewares, this.file.uploadFile);
        this.router.get(`/v1/${this.path}/:file_id/preview`, _authmiddleware.AuthMiddleware, this.file.getFileWithUUID);
        this.router.get(`/v1/${this.path}/mine`, _authmiddleware.AuthMiddleware, this.file.getFileMine);
    }
    constructor(){
        _define_property(this, "path", "files");
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "file", new _filecontroller.FileController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=files.routes.js.map