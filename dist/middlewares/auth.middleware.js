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
    get AuthMiddleware () {
        return AuthMiddleware;
    },
    get AuthorizedRoles () {
        return AuthorizedRoles;
    }
});
const _jsonwebtoken = require("jsonwebtoken");
const _index = require("../config/index");
const _HttpException = require("../exceptions/HttpException");
const _authservice = require("../services/auth.service");
const _userAgent = require("../utils/userAgent");
const getAuthorization = (req)=>{
    const coockie = req.cookies["Authorization"];
    if (coockie) return coockie;
    const header = req.header("Authorization");
    if (header) return header.split("Bearer ")[1];
    return null;
};
const AuthorizedRoles = (roles)=>{
    return async (req, res, next)=>{
        const userRoles = req.user_roles;
        const hasRequiredRole = roles.some((requiredRole)=>userRoles.includes(requiredRole));
        if (hasRequiredRole) {
            next();
        } else {
            next(new _HttpException.HttpException(false, 403, "Unauthorized Access #37"));
        }
    };
};
const AuthMiddleware = async (req, res, next)=>{
    try {
        const auth = new _authservice.AuthService();
        const Authorization = getAuthorization(req);
        const userAgentPayload = (0, _userAgent.getUserAgent)(req);
        if (Authorization) {
            var _userSession_user;
            const { uid, sid } = (0, _jsonwebtoken.verify)(Authorization, _index.SECRET_KEY);
            const userSession = await auth.checkSessionActive(sid);
            const userRoles = await auth.getUserRoles(userSession.user.pk);
            if ((userSession === null || userSession === void 0 ? void 0 : (_userSession_user = userSession.user) === null || _userSession_user === void 0 ? void 0 : _userSession_user.uuid) === uid) {
                if (userAgentPayload.source === userSession.useragent) {
                    req.session_id = sid;
                    req.user = userSession.user;
                    req.user_roles = userRoles.map((userRole)=>userRole.role.name);
                    next();
                } else {
                    next(new _HttpException.HttpException(false, 401, "Invalid Token #60"));
                }
            } else {
                next(new _HttpException.HttpException(false, 401, "Invalid Token #63"));
            }
        } else {
            next(new _HttpException.HttpException(false, 401, "Invalid Token #66"));
        }
    } catch (error) {
        next(new _HttpException.HttpException(false, 401, "Invalid Token #70"));
    }
};

//# sourceMappingURL=auth.middleware.js.map