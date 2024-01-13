import Mail from "nodemailer/lib/mailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

const sendEmail = ({
  from,
  to,
  subject,
  body, // can be an html
  attachments,
}: {
  from: string;
  to: string;
  subject: string;
  body: string;
  attachments?: Mail.Attachment[] | undefined;
}): Promise<SMTPTransport.SentMessageInfo> =>
  SMTPTransporter.sendMail({
    from,
    to,
    subject,
    text: body,
    attachments,
  });

export { sendEmail };
