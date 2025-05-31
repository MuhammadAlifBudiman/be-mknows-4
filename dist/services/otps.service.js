"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OTPService", {
    enumerable: true,
    get: function() {
        return OTPService;
    }
});
const _typedi = require("typedi");
const _dblazy = require("../database/db-lazy");
const _HttpException = require("../exceptions/HttpException");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let OTPService = class OTPService {
    async createOTP(data, validInMinutes, transaction) {
        const key = Math.floor(Math.pow(10, 8 - 1) + Math.random() * 9 * Math.pow(10, 8 - 1)).toString();
        const currentDateTime = new Date();
        const expirationTime = new Date(currentDateTime.getTime() + validInMinutes * 60000);
        const otp = await (await (0, _dblazy.getDB)()).OTPs.create({
            user_id: data.user_id,
            key,
            type: data.type,
            status: "AVAILABLE",
            expired_at: expirationTime
        }, {
            transaction
        });
        return otp;
    }
    async findOTP(data) {
        const otp = await (await (0, _dblazy.getDB)()).OTPs.findOne({
            where: {
                user_id: data.user_id,
                key: data.key,
                status: "AVAILABLE"
            }
        });
        if (!otp) {
            throw new _HttpException.HttpException(false, 400, "OTP is not valid");
        }
        if (new Date(otp.expired_at) < new Date()) {
            otp.status = "EXPIRED";
            await otp.save();
            throw new _HttpException.HttpException(false, 400, "OTP is not valid");
        }
        otp.status = "USED";
        await otp.save();
        return true;
    }
};
OTPService = _ts_decorate([
    (0, _typedi.Service)()
], OTPService);

//# sourceMappingURL=otps.service.js.map