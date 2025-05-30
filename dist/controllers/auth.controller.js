"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthController", {
    enumerable: true,
    get: function() {
        return AuthController;
    }
});
const _typedi = require("typedi");
const _expressasynchandler = /*#__PURE__*/ _interop_require_default(require("express-async-handler"));
const _authservice = require("../services/auth.service");
const _userAgent = require("../utils/userAgent");
const _apiResponse = require("../utils/apiResponse");
const _HttpException = require("../exceptions/HttpException");
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
let AuthController = class AuthController {
    constructor(){
        _define_property(this, "auth", _typedi.Container.get(_authservice.AuthService));
        _define_property(this, "signUp", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const userData = req.body;
            const signUpUserData = await this.auth.signup(userData);
            res.status(201).json((0, _apiResponse.apiResponse)(201, "OK", "Register Success", signUpUserData));
        }));
        _define_property(this, "logIn", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const userAgentPayload = (0, _userAgent.getUserAgent)(req);
            const userData = req.body;
            const { cookie, accessToken } = await this.auth.login(userData, userAgentPayload);
            res.setHeader("Set-Cookie", [
                cookie
            ]);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Login Success", {
                access_token: accessToken
            }));
        }));
        _define_property(this, "logOut", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const userData = req.user;
            const userSessionId = req.session_id;
            await this.auth.logout(userData, userSessionId);
            res.setHeader("Set-Cookie", [
                "Authorization=; Max-age=0"
            ]);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Logout Success", {}));
        }));
        _define_property(this, "verifyEmail", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const { uuid, otp } = req.body;
            if (!uuid || !otp) throw new _HttpException.HttpException(false, 400, "UUID and OTP is required");
            const response = await this.auth.verifyEmail(uuid, otp);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Email has been verified", {
                email: response.email
            }));
        }));
    }
};

//# sourceMappingURL=auth.controller.js.map