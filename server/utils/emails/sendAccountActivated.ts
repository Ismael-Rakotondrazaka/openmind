export const sendAccountActivated = ({
  email,
  firstName,
}: {
  email: string;
  firstName: string;
}) => {
  const runtimeConfig = useRuntimeConfig();

  return sendEmail({
    from: runtimeConfig.informationEmail,
    to: email,
    subject: "Welcome to OpenMind!",
    body: formatEmail({
      body: `<h2 style="color:#000;">Welcome to OpenMind!</h2><p style="font-size: 11pt; font-family: sans-serif; color:#000;">Hello ${sanitize(
        firstName,
      )},<br>We are excited to inform you that your OpenMind account has been successfully activated. Welcome to our community!</p><p style="font-size: 11pt; font-family: sans-serif; color:#000;">OpenMind is a platform dedicated to diverse perspectives and shared knowledge. You can explore a wide range of topics through engaging blog posts contributed by our community members.</p><p style="font-size: 11pt; font-family: sans-serif; color:#000;">If you have any questions, want to start sharing your thoughts, or explore interesting topics, feel free to get started by clicking the button below:<br /><a href="${
        runtimeConfig.public.appUrl
      }/stories"style="font-size: 11pt; font-family: sans-serif;display: inline-block; padding: 10px 20px; background-color: #14b8a6; color: #fff; text-decoration: none; border-radius: 3px;">Explore</a></p><p style="font-size: 11pt; font-family: sans-serif; color:#000;">We're thrilled to have you as part of OpenMind. If you need any assistance, please don't hesitate to reach out.</p><p style="font-size: 11pt; font-family: sans-serif; color:#000;">Happy exploring!</p><p style="font-size: 11pt; font-family: sans-serif; color:#000;">Best regards,</p>`,
      senderEmail: runtimeConfig.informationEmail,
      senderName: "The OpenMind team",
      title: "Welcome to OpenMind!",
    }),
  });
};
