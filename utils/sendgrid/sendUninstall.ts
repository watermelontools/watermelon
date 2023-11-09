export default async function sendUninstall({ emails }: { emails: string[] }) {
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: emails,
    from: "info@watermelon.tools",
    templateId: "d-21dcf37205e4479d830dbcfd35cb41d6",
  };
  sgMail
    .sendMultiple(msg)
    .then(() => {
      console.log("Email sent");
      return { success: true };
    })
    .catch((error) => {
      console.error(error);
    });
}
