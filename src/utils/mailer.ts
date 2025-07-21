import ejs from "ejs";
import path from "path";
import fs from "fs";
import { sendEmail } from "@config/node-mailer";
import { logger } from "@utils/logger";

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
