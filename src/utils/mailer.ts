// Import ejs for rendering email templates
import ejs from "ejs";
// Import path for file path operations
import path from "path";
// Import fs for file system checks
import fs from "fs";
// Import sendEmail function for sending emails
import { sendEmail } from "@config/node-mailer";
// Import logger for logging information
import { logger } from "@utils/logger";

/**
 * Sends an email verification OTP to the user's email address.
 *
 * @param {object} data - Data object containing email, full_name, otp, and expiration_time.
 * @returns {Promise<void>} - Resolves when the email is sent.
 *
 * - Loads and renders the EJS template for email verification.
 * - Logs template path and existence for debugging.
 * - Sends the rendered template via email.
 */
export const sendEmailOTP = async (data): Promise<void> => {
  // Use require.resolve to force Vercel to bundle the template
  const templatePath = require.resolve("../../public/templates/email-verification.ejs");
  logger.info(`[sendEmailOTP] templatePath: ${templatePath}`);
  logger.info(`[sendEmailOTP] file exists: ${fs.existsSync(templatePath)}`);

  const template = await ejs.renderFile(
    templatePath,
    { data },
  );

  await sendEmail(data.email, "Email Verification", template);
};
