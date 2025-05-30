"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AccountRoute", {
    enumerable: true,
    get: function() {
        return AccountRoute;
    }
});
const _express = require("express");
const _accountcontroller = require("../controllers/account.controller");
const _authmiddleware = require("../middlewares/auth.middleware");
const _validationmiddleware = require("../middlewares/validation.middleware");
const _accountdto = require("../dtos/account.dto");
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
let AccountRoute = class AccountRoute {
    initializeRoutes() {
        this.router.get(`/v1/${this.path}/profile/me`, _authmiddleware.AuthMiddleware, this.account.getMyProfile);
        this.router.get(`/v1/${this.path}/sessions/me`, _authmiddleware.AuthMiddleware, this.account.getMySessionsHistories);
        this.router.put(`/v1/${this.path}/profile/me`, _authmiddleware.AuthMiddleware, (0, _validationmiddleware.ValidationMiddleware)(_accountdto.UpdateUserProfileDto), this.account.updateMyProfile);
    }
    constructor(){
        _define_property(this, "path", "account");
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "account", new _accountcontroller.AccountController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=account.routes.js.map