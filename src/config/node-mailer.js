/**
 * NodeMailer configuration and email sending utility
 * Uses Gmail SMTP with credentials from environment variables
 */
import { createTransport } from "nodemailer"; // Import NodeMailer transport creator
import { apiResponse } from "@utils/apiResponse"; // Import custom API response utility
import {
  GOOGLE_EMAIL, GOOGLE_APP_PASSWORD,
} from "@config/index"; // Import Google email credentials from config

/**
 * Sends an email using Gmail SMTP
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} templates - HTML content for the email body
 * @returns {Promise<void>} Returns nothing, but logs and responds on error
 */
export const sendEmail = async (to, subject, templates) => {
  try {
    // Create a transporter object using Gmail service and credentials
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: GOOGLE_EMAIL,
        pass: GOOGLE_APP_PASSWORD,
      },
      // host: "smtp.gmail.com",
      // port: 587,
      // secure: false, // true for 465, false for other ports
    });

    // Define mail options including sender, recipient, subject, and HTML body
    const mailOptions = {
      from: "Bootcamp <no-reply@m-knowsconsulting.com>",
      replyTo: "no-reply@m-knowsconsulting.com",
      to,
      subject: `Bootcamp - ${subject}`,
      html: templates,
    };

    // Send the email and handle callback for success or error
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(`Error Transporter: ${err.message}`);
        return apiResponse(400, "INTERNAL SERVER ERROR", err.message);
      }
      // Log success info
      console.info(`Successfully sent email to ${to} with subject - ${mailOptions.subject}`);
      console.info(`Email sent: ${info.response}`);
    });
  } catch (error) {
    // Handle unexpected errors
    throw apiResponse(status.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", error.message);
  }
};