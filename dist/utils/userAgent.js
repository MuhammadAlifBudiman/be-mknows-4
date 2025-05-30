"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getUserAgent", {
    enumerable: true,
    get: function() {
        return getUserAgent;
    }
});
const _expressuseragent = require("express-useragent");
const getUserAgent = (req)=>{
    var _req_clientIp;
    const userAgent = new _expressuseragent.UserAgent().parse(req.headers["user-agent"]);
    const userAgentPayload = {
        browser: userAgent.browser,
        version: userAgent.version,
        os: userAgent.os,
        platform: userAgent.platform,
        ip_address: ((_req_clientIp = req.clientIp) === null || _req_clientIp === void 0 ? void 0 : _req_clientIp.replace("::ffff:", "")) || req.socket.remoteAddress || req.connection.remoteAddress || req.headers["x-forwarded-for"],
        referrer: req.headers.referer,
        source: userAgent.source
    };
    return userAgentPayload;
};

//# sourceMappingURL=userAgent.js.map