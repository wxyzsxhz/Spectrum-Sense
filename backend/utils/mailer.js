// utils/mailer.js
import nodemailer from "nodemailer";
import { MAIL_HOST, MAIL_PASSWORD, MAIL_PORT, MAIL_USER } from "../config.js";

export const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: false,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
});
