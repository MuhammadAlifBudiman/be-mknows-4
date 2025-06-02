import ejs from "ejs";
import path from "path";
import fs from "fs";
import { sendEmail } from "@config/node-mailer";
import { logger } from "@utils/logger";

export const sendEmailOTP = async (data): Promise<void> => {
  const templatePath = path.join(__dirname, "../public/templates/email-verification.ejs");
  logger.info(`[sendEmailOTP] __dirname: ${__dirname}`);
  logger.info(`[sendEmailOTP] templatePath: ${templatePath}`);
  logger.info(`[sendEmailOTP] file exists: ${fs.existsSync(templatePath)}`);

  const template = await ejs.renderFile(
    templatePath,
    { data },
  );

  await sendEmail(data.email, "Email Verification", template);
};
