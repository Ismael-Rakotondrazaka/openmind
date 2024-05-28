import { createTransport, type Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

const SMTPTransporter: Transporter<SMTPTransport.SentMessageInfo> =
  createTransport({
    // @ts-expect-error @types/nodemailer is out of date
    host: useRuntimeConfig().smtpHost,
    port: useRuntimeConfig().smtpPort,
    secure: true,
    auth: {
      user: useRuntimeConfig().smtpUser,
      pass: useRuntimeConfig().smtpPassword,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });

export { SMTPTransporter };
