export default async function sendTeammateInvite({
  teammateEmail,
  sender,
  inviteUrl,
  teamName,
}: {
  teammateEmail: string;
  sender: string;
  inviteUrl: string;
  teamName: string;
}) {
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: teammateEmail,
    from: "info@watermelon.tools",
    templateId: "d-dd5c729f0be5439daac6b1faaf0431d6",
    dynamic_template_data: {
      sender,
      inviteUrl,
      teamName,
    },
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
      return { success: true };
    })
    .catch((error) => {
      console.error(error);
    });
}
