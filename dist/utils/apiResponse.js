"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "apiResponse", {
    enumerable: true,
    get: function() {
        return apiResponse;
    }
});
function apiResponse(code, responseStatus, message, data, meta) {
    return {
        code,
        status: responseStatus,
        message,
        data: data || {},
        meta
    };
}

//# sourceMappingURL=apiResponse.js.map