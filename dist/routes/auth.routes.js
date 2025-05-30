"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthRoute", {
    enumerable: true,
    get: function() {
        return AuthRoute;
    }
});
const _express = require("express");
const _authcontroller = require("../controllers/auth.controller");
const _authmiddleware = require("../middlewares/auth.middleware");
const _validationmiddleware = require("../middlewares/validation.middleware");
const _usersdto = require("../dtos/users.dto");
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
let AuthRoute = class AuthRoute {
    initializeRoutes() {
        this.router.post(`/v1/${this.path}/register`, (0, _validationmiddleware.ValidationMiddleware)(_usersdto.CreateUserDto), this.auth.signUp);
        this.router.post(`/v1/${this.path}/login`, (0, _validationmiddleware.ValidationMiddleware)(_usersdto.LoginUserDto), this.auth.logIn);
        this.router.post(`/v1/${this.path}/logout`, _authmiddleware.AuthMiddleware, this.auth.logOut);
        this.router.post(`/v1/${this.path}/verify`, this.auth.verifyEmail);
    }
    constructor(){
        _define_property(this, "path", "auth");
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "auth", new _authcontroller.AuthController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=auth.routes.js.map