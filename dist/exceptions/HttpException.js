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
    get HttpException () {
        return HttpException;
    },
    get HttpExceptionTooManyRequests () {
        return HttpExceptionTooManyRequests;
    }
});
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
let HttpException = class HttpException extends Error {
    constructor(success, status, message, errors){
        super(message), _define_property(this, "success", void 0), _define_property(this, "status", void 0), _define_property(this, "message", void 0), _define_property(this, "errors", void 0);
        this.success = success;
        this.status = status;
        this.message = message;
        this.errors = errors;
    }
};
let HttpExceptionTooManyRequests = class HttpExceptionTooManyRequests extends HttpException {
    constructor(errors){
        super(false, 429, "TOO_MANY_REQUEST", errors);
    }
};

//# sourceMappingURL=HttpException.js.map