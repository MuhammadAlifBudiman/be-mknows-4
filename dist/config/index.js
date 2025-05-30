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
    get CREDENTIALS () {
        return CREDENTIALS;
    },
    get DB_DATABASE () {
        return DB_DATABASE;
    },
    get DB_HOST () {
        return DB_HOST;
    },
    get DB_PASSWORD () {
        return DB_PASSWORD;
    },
    get DB_PORT () {
        return DB_PORT;
    },
    get DB_USER () {
        return DB_USER;
    },
    get GOOGLE_APP_PASSWORD () {
        return GOOGLE_APP_PASSWORD;
    },
    get GOOGLE_EMAIL () {
        return GOOGLE_EMAIL;
    },
    get LOG_DIR () {
        return LOG_DIR;
    },
    get LOG_FORMAT () {
        return LOG_FORMAT;
    },
    get MAX_SIZE_FILE_UPLOAD () {
        return MAX_SIZE_FILE_UPLOAD;
    },
    get NODE_ENV () {
        return NODE_ENV;
    },
    get ORIGIN () {
        return ORIGIN;
    },
    get PORT () {
        return PORT;
    },
    get RATE_DELAY () {
        return RATE_DELAY;
    },
    get RATE_LIMIT () {
        return RATE_LIMIT;
    },
    get SECRET_KEY () {
        return SECRET_KEY;
    }
});
const _dotenv = require("dotenv");
(0, _dotenv.config)({
    path: `.env.${process.env.NODE_ENV || "development"}.local`
});
const CREDENTIALS = process.env.CREDENTIALS === "true";
const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE } = process.env;
const { RATE_DELAY, RATE_LIMIT } = process.env;
const { MAX_SIZE_FILE_UPLOAD } = process.env;
const { GOOGLE_EMAIL, GOOGLE_APP_PASSWORD } = process.env;

//# sourceMappingURL=index.js.map