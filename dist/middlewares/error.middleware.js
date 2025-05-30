"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ErrorMiddleware", {
    enumerable: true,
    get: function() {
        return ErrorMiddleware;
    }
});
const _logger = require("../utils/logger");
const ErrorMiddleware = (error, req, res, next)=>{
    try {
        const status = error.status || 500;
        const message = error.message || "Something went wrong";
        const errors = error.errors || [];
        if (message.endsWith("does not exist")) {
            _logger.logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
            res.status(400).json({
                code: 400,
                status: "BAD REQUEST",
                message: "Invalid Property",
                errors
            });
        } else if (message.startsWith("invalid input syntax for")) {
            _logger.logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
            res.status(400).json({
                code: 400,
                status: "BAD REQUEST",
                message: "Invalid UUID",
                errors
            });
        } else {
            _logger.logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
            res.status(status).json({
                code: status,
                status: "BAD REQUEST",
                message,
                errors
            });
        }
    } catch (error) {
        next(error);
    }
};

//# sourceMappingURL=error.middleware.js.map