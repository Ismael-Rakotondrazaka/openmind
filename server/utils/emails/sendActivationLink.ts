import { authConfig } from "~/utils";
import { useDayjs } from "~/composables";

export const sendActivationLink = ({
  email,
  activationLink,
  firstName,
}: {
  email: string;
  activationLink: string;
  firstName: string;
}) => {
  const runtimeConfig = useRuntimeConfig();
  const dayjs = useDayjs();
  const validity: string = dayjs.duration(authConfig.TOKEN_VALIDITY).humanize();

  return sendEmail({
    from: runtimeConfig.informationEmail,
    to: email,
    subject: "Activate Your OpenMind Account",
    body: formatEmail({
      body: `<h2 style="color:#000;">Activate Your OpenMind Account</h2><p style="font-size: 11pt; font-family: sans-serif; color:#000;">Hello ${sanitize(
        firstName,
      )},<br>Thank you for registering with OpenMind, a platform dedicated to diverse perspectives and shared knowledge. OpenMind allows you to explore a multitude of topics through engaging blog posts from our community.</p><p style="font-size: 11pt; font-family: sans-serif; color:#000;">To activate your account, please click the button below:<br/><a href="${activationLink}" style="font-size: 11pt; font-family: sans-serif;display: inline-block; padding: 10px 20px; background-color: #14b8a6; color: #fff; text-decoration: none; border-radius: 3px;">Activate Your Account</a></p><p style="font-size: 11pt; font-family: sans-serif; color:#000;">If you are unable to click the button, please copy and paste the following link into your browser:<br/><span style="font-size: 11pt; font-family: sans-serif; color:#15c;">${activationLink}</span></p><p style="font-size: 11pt; font-family: sans-serif; color:#000;">Your account will be fully activated once you complete this verification process.</p><p style="font-size: 11pt; font-family: sans-serif; color:#000;">Note that the link is valid only for ${validity}.</p><p style="font-size: 11pt; font-family: sans-serif; color:#000;">OpenMind aims to create a space where individuals can contribute and discover content on a wide range of subjects.</p><p style="font-size: 11pt; font-family: sans-serif; color:#000;">If you have any questions or need assistance, feel free to ask via <a href="mailto:${
        runtimeConfig.informationEmail
      }">${
        runtimeConfig.informationEmail
      }</a>.</p><p style="font-size: 11pt; font-family: sans-serif; color:#000;">Best regards,</p>`,
      senderEmail: runtimeConfig.informationEmail,
      senderName: "The OpenMind team",
      title: "Activate Your OpenMind Account",
    }),
  });
};
