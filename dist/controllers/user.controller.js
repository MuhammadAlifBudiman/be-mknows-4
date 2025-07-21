"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserController", {
    enumerable: true,
    get: function() {
        return UserController;
    }
});
const _typedi = require("typedi");
const _expressasynchandler = /*#__PURE__*/ _interop_require_default(require("express-async-handler"));
const _usersservice = require("../services/users.service");
const _apiResponse = require("../utils/apiResponse");
const _userAgent = require("../utils/userAgent");
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
let UserController = class UserController {
    constructor(){
        _define_property(this, "user", _typedi.Container.get(_usersservice.UserService));
        _define_property(this, "getUseragent", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const userAgentPayload = (0, _userAgent.getUserAgent)(req);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "User Agent Retrieved", userAgentPayload));
        }));
        _define_property(this, "getUsers", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const findAllUsersData = await this.user.findAllUser();
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "All Users Retrieved", findAllUsersData));
        }));
        _define_property(this, "getUserByUUID", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const user_uuid = req.params.uuid;
            const findOneUserData = await this.user.findUserByUUID(user_uuid);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "User Retrieved", findOneUserData));
        }));
    }
};

//# sourceMappingURL=user.controller.js.map