"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "sendEmailOTP", {
    enumerable: true,
    get: function() {
        return sendEmailOTP;
    }
});
const _ejs = /*#__PURE__*/ _interop_require_default(require("ejs"));
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _nodemailer = require("../config/node-mailer");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const sendEmailOTP = async (data)=>{
    const template = await _ejs.default.renderFile(_path.default.join(__dirname, "../public/templates/email-verification.ejs"), {
        data
    });
    await (0, _nodemailer.sendEmail)(data.email, "Email Verification", template);
};

//# sourceMappingURL=mailer.js.map