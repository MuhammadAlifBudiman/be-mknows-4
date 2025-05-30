"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AccountController", {
    enumerable: true,
    get: function() {
        return AccountController;
    }
});
const _expressasynchandler = /*#__PURE__*/ _interop_require_default(require("express-async-handler"));
const _typedi = require("typedi");
const _accountservice = require("../services/account.service");
const _apiResponse = require("../utils/apiResponse");
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
let AccountController = class AccountController {
    constructor(){
        _define_property(this, "account", _typedi.Container.get(_accountservice.AccountService));
        _define_property(this, "getMyProfile", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const user_id = req.user.pk;
            const user = await this.account.getProfileByUserId(user_id);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Get Profile Success", user));
        }));
        _define_property(this, "getMySessionsHistories", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const user_id = req.user.pk;
            const session_id = req.session_id;
            const userSessions = await this.account.getSessionsHistoriesByUserId(user_id, session_id);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Get Sessions Histories Success", userSessions));
        }));
        _define_property(this, "updateMyProfile", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const user_id = req.user.pk;
            const updatedProfile = req.body;
            const user = await this.account.updateUserProfile(user_id, updatedProfile);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Get Profile Success", user));
        }));
    }
};

//# sourceMappingURL=account.controller.js.map