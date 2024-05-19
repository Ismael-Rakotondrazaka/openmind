import { authConfig } from "~/utils";
import { useDayjs } from "~/composables";

export const sendPasswordResetLink = ({
  email,
  passwordResetLink,
  firstName,
}: {
  email: string;
  passwordResetLink: string;
  firstName: string;
}) => {
  const runtimeConfig = useRuntimeConfig();
  const dayjs = useDayjs();
  const validity: string = dayjs.duration(authConfig.TOKEN_VALIDITY).humanize();

  return sendEmail({
    from: runtimeConfig.informationEmail,
    to: email,
    subject: "Reset Your OpenMind Account Password",
    body: formatEmail({
      body: `<h2 style="color:#000;">Reset Your OpenMind Account Password</h2><p style="font-size: 11pt; font-family: sans-serif; color:#000;">Hello ${sanitize(
        firstName,
      )},<br>We received a request to reset the password for your OpenMind account. OpenMind allows you to explore a multitude of topics through engaging blog posts from our community.</p><p style="font-size: 11pt; font-family: sans-serif; color:#000;">To reset your password, please click the button below:<br/><a href="${passwordResetLink}" style="font-size: 11pt; font-family: sans-serif;display: inline-block; padding: 10px 20px; background-color: #14b8a6; color: #fff; text-decoration: none; border-radius: 3px;">Reset Your Password</a></p><p style="font-size: 11pt; font-family: sans-serif; color:#000;">If you are unable to click the button, please copy and paste the following link into your browser:<br/><span style="font-size: 11pt; font-family: sans-serif; color:#15c;">${passwordResetLink}</span></p><p style="font-size: 11pt; font-family: sans-serif; color:#000;">This link is valid only for ${validity}.</p><p style="font-size: 11pt; font-family: sans-serif; color:#000;">If you did not request a password reset, please ignore this email or contact support if you have questions.</p><p style="font-size: 11pt; font-family: sans-serif; color:#000;">OpenMind aims to create a space where individuals can contribute and discover content on a wide range of subjects.</p><p style="font-size: 11pt; font-family: sans-serif; color:#000;">If you have any questions or need assistance, feel free to ask via <a href="mailto:${runtimeConfig.informationEmail}">${runtimeConfig.informationEmail}</a>.</p><p style="font-size: 11pt; font-family: sans-serif; color:#000;">Best regards,</p>`,
      senderEmail: runtimeConfig.informationEmail,
      senderName: "The OpenMind team",
      title: "Reset Your OpenMind Account Password",
    }),
  });
};
