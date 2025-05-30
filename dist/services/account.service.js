"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AccountService", {
    enumerable: true,
    get: function() {
        return AccountService;
    }
});
const _typedi = require("typedi");
const _database = require("../database");
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
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AccountService = class AccountService {
    async getProfileByUserId(user_id) {
        const user = await _database.DB.Users.findOne({
            attributes: {
                exclude: [
                    "pk"
                ]
            },
            where: {
                pk: user_id
            }
        });
        const file = await _database.DB.Files.findOne({
            where: {
                pk: user.display_picture
            }
        });
        const response = _object_spread_props(_object_spread({}, user.get()), {
            display_picture: file === null || file === void 0 ? void 0 : file.uuid
        });
        return response;
    }
    async getSessionsHistoriesByUserId(user_id, session_id) {
        const userSessions = await _database.DB.UsersSessions.findAll({
            attributes: {
                exclude: [
                    "pk",
                    "user_id"
                ]
            },
            where: {
                user_id
            }
        });
        const userSessionsParsed = userSessions.map((session)=>_object_spread_props(_object_spread({}, session.get()), {
                is_current: session.uuid === session_id
            }));
        userSessionsParsed.sort((a, b)=>(b.is_current ? 1 : 0) - (a.is_current ? 1 : 0));
        return userSessionsParsed;
    }
    async updateUserProfile(user_id, data) {
        const updatedData = {};
        if (data.full_name) updatedData.full_name = data.full_name;
        if (data.display_picture) {
            const file = await _database.DB.Files.findOne({
                attributes: [
                    "pk"
                ],
                where: {
                    uuid: data.display_picture,
                    user_id
                }
            });
            if (!file) {
                throw new _HttpException.HttpException(false, 400, "File is not found");
            }
            updatedData.display_picture = file.pk;
        }
        if (Object.keys(updatedData).length === 0) {
            throw new _HttpException.HttpException(false, 400, "Some field is required");
        }
        const [_, [user]] = await _database.DB.Users.update(updatedData, {
            where: {
                pk: user_id
            },
            returning: true
        });
        delete user.dataValues.pk;
        delete user.dataValues.password;
        const file = await _database.DB.Files.findOne({
            where: {
                pk: user.display_picture
            }
        });
        const response = _object_spread_props(_object_spread({}, user.get()), {
            display_picture: file === null || file === void 0 ? void 0 : file.uuid
        });
        return response;
    }
};
AccountService = _ts_decorate([
    (0, _typedi.Service)()
], AccountService);

//# sourceMappingURL=account.service.js.map