"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserRoute", {
    enumerable: true,
    get: function() {
        return UserRoute;
    }
});
const _express = require("express");
const _usercontroller = require("../controllers/user.controller");
const _authmiddleware = require("../middlewares/auth.middleware");
const _ratelimittermiddleware = /*#__PURE__*/ _interop_require_default(require("../middlewares/rate-limitter.middleware"));
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let UserRoute = class UserRoute {
    initializeRoutes() {
        this.router.get(`/v1/users/check`, this.user.getUseragent);
        this.router.get(`/v1/${this.path}`, this.limitter.default(), _authmiddleware.AuthMiddleware, (0, _authmiddleware.AuthorizedRoles)([
            "ADMIN"
        ]), this.user.getUsers);
        this.router.get(`/v1/${this.path}/:uuid`, this.user.getUserByUUID);
    }
    constructor(){
        _define_property(this, "path", "users");
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "user", new _usercontroller.UserController());
        _define_property(this, "limitter", new _ratelimittermiddleware.default());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=users.routes.js.map