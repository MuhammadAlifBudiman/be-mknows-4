"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _expressratelimit = require("express-rate-limit");
const _index = require("../config/index");
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
let Limitter = class Limitter {
    constructor(){
        _define_property(this, "default", ()=>{
            const delay = Number(_index.RATE_DELAY) * 60 * 1000;
            return (0, _expressratelimit.rateLimit)({
                windowMs: delay,
                max: Number(_index.RATE_LIMIT),
                keyGenerator: (req)=>req.ip,
                handler: ()=>{
                    throw new _HttpException.HttpExceptionTooManyRequests([
                        `Too many requests from this IP, please try again after ${_index.RATE_DELAY} minutes`
                    ]);
                }
            });
        });
        _define_property(this, "emailVerification", ()=>{
            const delay = 3 * 60 * 1000;
            return (0, _expressratelimit.rateLimit)({
                windowMs: delay,
                max: 5,
                keyGenerator: (req)=>req.ip,
                handler: ()=>{
                    throw new _HttpException.HttpExceptionTooManyRequests([
                        "Too many requests from this IP, please try again after 5 minutes"
                    ]);
                }
            });
        });
    }
};
const _default = Limitter;

//# sourceMappingURL=rate-limitter.middleware.js.map