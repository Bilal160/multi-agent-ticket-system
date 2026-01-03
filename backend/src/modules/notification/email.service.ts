import nodemailer from 'nodemailer';
import { config } from '../../config/env';
import { logger } from '../../utils/logger';

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: config.SMTP_PORT === 465,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, body: string): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: config.SMTP_FROM,
      to,
      subject,
      text: body,
      html: `<p>${body}</p>`,
    });
    logger.info(`To: ${to} | ID: ${info.messageId}`);
  } catch (error) {
    logger.error(`To: ${to} | Error: ${error}`);
  }
};
