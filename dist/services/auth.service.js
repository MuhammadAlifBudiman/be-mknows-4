"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthService", {
    enumerable: true,
    get: function() {
        return AuthService;
    }
});
const _bcrypt = require("bcrypt");
const _jsonwebtoken = require("jsonwebtoken");
const _typedi = require("typedi");
const _index = require("../config/index");
const _database = require("../database");
const _otpsservice = require("./otps.service");
const _HttpException = require("../exceptions/HttpException");
const _mailer = require("../utils/mailer");
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
const createAccessToken = (user, userSession)=>{
    const dataStoredInToken = {
        uid: user.uuid,
        sid: userSession.uuid
    };
    const expiresIn = 60 * 60 * 60;
    return {
        expiresIn: expiresIn,
        token: (0, _jsonwebtoken.sign)(dataStoredInToken, _index.SECRET_KEY, {
            expiresIn
        })
    };
};
const createCookie = (TokenPayload)=>{
    return `Authorization=${TokenPayload.token}; HttpOnly; Max-Age=${TokenPayload.expiresIn};`;
};
let AuthService = class AuthService {
    async signup(userData) {
        const transaction = await _database.DB.sequelize.transaction();
        try {
            const existingUser = await _database.DB.Users.findOne({
                where: {
                    email: userData.email
                },
                transaction
            });
            if (existingUser) {
                throw new _HttpException.HttpException(false, 409, `This email ${userData.email} already exists`);
            }
            const hashedPassword = await (0, _bcrypt.hash)(userData.password, 10);
            const createUser = await _database.DB.Users.create(_object_spread_props(_object_spread({}, userData), {
                password: hashedPassword
            }), {
                transaction
            });
            const roleId = await this.getRoleId("USER");
            await this.asignUserRole(createUser.pk, roleId, transaction);
            const validInMinutes = 10;
            const otp = await new _otpsservice.OTPService().createOTP({
                user_id: createUser.pk,
                type: "EMAIL_VERIFICATION"
            }, validInMinutes, transaction);
            await (0, _mailer.sendEmailOTP)({
                email: createUser.email,
                full_name: createUser.full_name,
                otp: otp.key,
                expiration_time: validInMinutes
            });
            await transaction.commit();
            return {
                uuid: createUser.uuid,
                email: createUser.email
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async login(userData, userAgent) {
        const findUser = await _database.DB.Users.findOne({
            attributes: [
                "pk",
                "uuid",
                "password",
                "email_verified_at"
            ],
            where: {
                email: userData.email
            }
        });
        if (!findUser) throw new _HttpException.HttpException(false, 409, `This email ${userData.email} was not found`);
        const isPasswordMatching = await (0, _bcrypt.compare)(userData.password, findUser.password);
        if (!isPasswordMatching) throw new _HttpException.HttpException(false, 409, "Password not matching");
        if (!findUser.email_verified_at) throw new _HttpException.HttpException(false, 400, "Email is not verified");
        const sessionData = await this.createUserSession({
            pk: findUser.pk,
            useragent: userAgent.source,
            ip_address: userAgent.ip_address
        });
        const TokenPayload = createAccessToken(findUser, sessionData);
        const { token } = TokenPayload;
        const cookie = createCookie(TokenPayload);
        return {
            cookie,
            accessToken: token
        };
    }
    async logout(userData, userSessionId) {
        const findUser = await _database.DB.Users.findOne({
            where: {
                pk: userData.pk
            }
        });
        if (!findUser) throw new _HttpException.HttpException(false, 409, "User doesn't exist");
        const logout = await this.logoutSessionActive({
            uid: findUser.uuid,
            sid: userSessionId
        });
        return logout;
    }
    async checkSessionActive(session_id) {
        const userSession = await _database.DB.UsersSessions.findOne({
            where: {
                uuid: session_id,
                status: "ACTIVE"
            },
            include: [
                {
                    model: _database.DB.Users,
                    as: "user"
                }
            ]
        });
        return userSession || null;
    }
    async getUserRoles(user_id) {
        const roles = await _database.DB.UsersRoles.findAll({
            where: {
                user_id
            },
            include: [
                {
                    model: _database.DB.Roles,
                    as: "role"
                }
            ]
        });
        return roles;
    }
    async logoutSessionActive(data) {
        const userSession = await _database.DB.UsersSessions.findOne({
            where: {
                uuid: data.sid,
                status: "ACTIVE"
            },
            include: {
                model: _database.DB.Users,
                as: "user"
            }
        });
        if (userSession) {
            userSession.status = "LOGOUT";
            await userSession.save();
            return true;
        } else {
            return true;
        }
    }
    async createUserSession(data) {
        const session = await _database.DB.UsersSessions.create({
            user_id: data.pk,
            useragent: data.useragent,
            ip_address: data.ip_address,
            status: "ACTIVE"
        });
        return session;
    }
    async getRoleId(name) {
        const role = await _database.DB.Roles.findOne({
            where: {
                name
            }
        });
        return role.pk;
    }
    async asignUserRole(user_id, role_id, transaction) {
        const role = await _database.DB.UsersRoles.create({
            user_id,
            role_id
        }, {
            transaction
        });
        return role;
    }
    async verifyEmail(user_uuid, otp) {
        const user = await _database.DB.Users.findOne({
            attributes: [
                "pk"
            ],
            where: {
                uuid: user_uuid
            }
        });
        if (!user) throw new _HttpException.HttpException(false, 400, "Invalid UUID");
        const valid = await new _otpsservice.OTPService().findOTP({
            user_id: user.pk,
            key: otp,
            type: "EMAIL_VERIFICATION"
        });
        if (valid) {
            user.email_verified_at = new Date();
            await user.save();
        }
        return {
            email: user.email
        };
    }
};
AuthService = _ts_decorate([
    (0, _typedi.Service)()
], AuthService);

//# sourceMappingURL=auth.service.js.map