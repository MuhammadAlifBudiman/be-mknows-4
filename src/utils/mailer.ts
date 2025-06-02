import ejs from "ejs";
import path from "path";
import { sendEmail } from "@config/node-mailer";
import { logger } from "@utils/logger";

export const sendEmailOTP = async (data): Promise<void> => {
  logger.info(`[sendEmailOTP] __dirname: ${__dirname}`); // log the current directory using logger
  const template = await ejs.renderFile(
    path.join(__dirname, "../public/templates/email-verification.ejs"),
    { data },
  );

  await sendEmail(data.email, "Email Verification", template);
};
