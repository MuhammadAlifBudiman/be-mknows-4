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
    get uploadFile () {
        return uploadFile;
    },
    get uploadToS3 () {
        return uploadToS3;
    }
});
const _multer = /*#__PURE__*/ _interop_require_default(require("multer"));
const _awssdk = /*#__PURE__*/ _interop_require_default(require("aws-sdk"));
const _HttpException = require("../exceptions/HttpException");
const _index = require("../config/index");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const s3 = new _awssdk.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});
const S3_BUCKET = process.env.AWS_S3_BUCKET;
const uploadFile = (0, _multer.default)({
    limits: {
        files: 10,
        fileSize: Number(_index.MAX_SIZE_FILE_UPLOAD)
    },
    storage: _index.NODE_ENV === 'production' ? _multer.default.memoryStorage() : _multer.default.diskStorage({
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
const uploadToS3 = async (req, res, next)=>{
    if (!req.file) return next();
    const params = {
        Bucket: S3_BUCKET,
        Key: `${Date.now()}-${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: "public-read"
    };
    try {
        const data = await s3.upload(params).promise();
        req.file.location = data.Location;
        next();
    } catch (err) {
        next(new _HttpException.HttpException(false, 500, "S3 Upload Failed"));
    }
};

//# sourceMappingURL=file-uploader.middleware.js.map