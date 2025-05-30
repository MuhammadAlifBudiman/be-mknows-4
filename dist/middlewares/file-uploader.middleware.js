"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "uploadFile", {
    enumerable: true,
    get: function() {
        return uploadFile;
    }
});
const _multer = /*#__PURE__*/ _interop_require_default(require("multer"));
const _HttpException = require("../exceptions/HttpException");
const _index = require("../config/index");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const uploadFile = (0, _multer.default)({
    limits: {
        files: 10,
        fileSize: Number(_index.MAX_SIZE_FILE_UPLOAD)
    },
    storage: _multer.default.diskStorage({
        destination: (req, file, cb)=>{
            cb(null, 'uploads/');
        },
        filename: (req, file, cb)=>{
            cb(null, Date.now() + '-' + file.originalname);
        }
    }),
    fileFilter (req, file, callback) {
        if (!file.mimetype.match(/^image|application\/(jpg|jpeg|png)$/)) {
            return callback(new _HttpException.HttpException(false, 400, "Invalid File Format"));
        }
        callback(null, true);
    }
});

//# sourceMappingURL=file-uploader.middleware.js.map