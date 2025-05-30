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
    get logger () {
        return logger;
    },
    get stream () {
        return stream;
    }
});
const _fs = require("fs");
const _path = require("path");
const _winston = /*#__PURE__*/ _interop_require_default(require("winston"));
const _winstondailyrotatefile = /*#__PURE__*/ _interop_require_default(require("winston-daily-rotate-file"));
const _index = require("../config/index");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const logDir = (0, _path.join)(__dirname, _index.LOG_DIR);
const isVercel = !!process.env.VERCEL;
if (!isVercel && !(0, _fs.existsSync)(logDir)) {
    (0, _fs.mkdirSync)(logDir);
}
const logFormat = _winston.default.format.printf(({ timestamp, level, message })=>`${timestamp} ${level}: ${message}`);
const transports = [
    new _winston.default.transports.Console({
        format: _winston.default.format.combine(_winston.default.format.splat(), _winston.default.format.colorize())
    })
];
if (!isVercel) {
    transports.push(new _winstondailyrotatefile.default({
        level: "debug",
        datePattern: "YYYY-MM-DD",
        dirname: logDir + "/debug",
        filename: "%DATE%.log",
        maxFiles: 30,
        json: false,
        zippedArchive: true
    }), new _winstondailyrotatefile.default({
        level: "error",
        datePattern: "YYYY-MM-DD",
        dirname: logDir + "/error",
        filename: "%DATE%.log",
        maxFiles: 30,
        handleExceptions: true,
        json: false,
        zippedArchive: true
    }));
}
const logger = _winston.default.createLogger({
    format: _winston.default.format.combine(_winston.default.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss"
    }), logFormat),
    transports
});
const stream = {
    write: (message)=>{
        logger.info(message.substring(0, message.lastIndexOf("\n")));
    }
};

//# sourceMappingURL=logger.js.map