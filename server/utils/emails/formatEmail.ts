export const formatEmail = ({
  body,
  senderName,
  title,
  senderEmail,
}: {
  title: string;
  body: string;
  senderName: string;
  senderEmail: string;
}): string => {
  const runtimeConfig = useRuntimeConfig();
  const appUrl: string = runtimeConfig.public.appUrl;
  const year: number = new Date().getFullYear();

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title></head><body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;"><div style="max-width: 900px; margin: 0 auto; background-color: #fff"><div style="background-color: #14b8a6; text-align: center; padding: 20px; clip-path: polygon(100% 0, 100% 77%, 72% 100%, 0 80%, 0 0);"><h1 style="font-size:20pt; font-weight: bold; margin: 0; padding: 0; color: #fff;">OpenMind</h1><p style="font-size:15pt; font-weight: bold; font-family:sans-serif; color:#fff;">Unleash Your Thoughts, Explore Every Topic.</p></div><div style="background-color: #fff; padding: 36px 20px 20px 20px; margin-top: -16px; color: #000">${body}<div style="max-width:900px;margin:0 auto;"><p style="font-size:11pt;font-family:sans-serif; color: #000;"><strong style="color: #000;">${senderName}</strong><br><span style="font-size:9pt;color:gray">E-mail&nbsp;: <a href="mailto:${senderEmail}" style="color:#0563c1">${senderEmail}</a></span><br><span style="font-size:9pt;color:gray">Website&nbsp;: <a href="${appUrl}" style="color:#0563c1">${appUrl}</a></span><br></p></div></div><hr style="background-color: gray; width: 95%; margin: 0 auto"><footer style="color: #000; background-color: #fff; text-align: center; padding: 10px;">&copy; ${year} OpenMind. Tous droits réservés.</footer></div></body></html>`;
};
