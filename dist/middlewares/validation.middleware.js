"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ValidationMiddleware", {
    enumerable: true,
    get: function() {
        return ValidationMiddleware;
    }
});
const _classtransformer = require("class-transformer");
const _classvalidator = require("class-validator");
const _HttpException = require("../exceptions/HttpException");
const ValidationMiddleware = (type, skipMissingProperties = false, whitelist = true, forbidNonWhitelisted = true)=>{
    return (req, res, next)=>{
        const dto = (0, _classtransformer.plainToInstance)(type, req.body);
        (0, _classvalidator.validateOrReject)(dto, {
            skipMissingProperties,
            whitelist,
            forbidNonWhitelisted
        }).then(()=>{
            req.body = dto;
            next();
        }).catch((errors)=>{
            const messages = errors.map((error)=>{
                if (Object.values(error.constraints)[0].endsWith("be empty")) {
                    return Object.values(error.constraints)[0].split("_").map((word)=>word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
                }
                if (Object.values(error.constraints)[0].endsWith("should not exist")) {
                    return "Invalid Property";
                }
                if (Object.values(error.constraints)[0].endsWith("be a UUID")) {
                    return Object.values(error.constraints)[0].split("_").map((word)=>word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
                }
                if (Object.values(error.constraints)[0].includes("characters")) {
                    return Object.values(error.constraints)[0].split("_").map((word)=>word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
                }
                return Object.values(error.constraints)[0];
            });
            next(new _HttpException.HttpException(false, 400, "Fields is required", messages));
        });
    };
};

//# sourceMappingURL=validation.middleware.js.map