"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "sendEmail", {
    enumerable: true,
    get: function() {
        return sendEmail;
    }
});
const _nodemailer = require("nodemailer");
const _apiResponse = require("../utils/apiResponse");
const _index = require("./index");
const sendEmail = async (to, subject, templates)=>{
    try {
        const transporter = (0, _nodemailer.createTransport)({
            service: "gmail",
            auth: {
                user: _index.GOOGLE_EMAIL,
                pass: _index.GOOGLE_APP_PASSWORD
            }
        });
        const mailOptions = {
            from: "Bootcamp <no-reply@m-knowsconsulting.com>",
            replyTo: "no-reply@m-knowsconsulting.com",
            to,
            subject: `Bootcamp - ${subject}`,
            html: templates
        };
        transporter.sendMail(mailOptions, (err, info)=>{
            if (err) {
                console.error(`Error Transporter: ${err.message}`);
                return (0, _apiResponse.apiResponse)(400, "INTERNAL SERVER ERROR", err.message);
            }
            console.info(`Successfully sent email to ${to} with subject - ${mailOptions.subject}`);
            console.info(`Email sent: ${info.response}`);
        });
    } catch (error) {
        throw (0, _apiResponse.apiResponse)(status.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", error.message);
    }
};

//# sourceMappingURL=node-mailer.js.map