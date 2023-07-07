export default async function sendTeammateInvite({
  email,
  sender,
  inviteUrl,
  teamName,
}: {
  email: string;
  sender: string;
  inviteUrl: string;
  teamName: string;
}) {
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: "info@watermelon.tools",
    templateId: "d-789789fdd54046659d75103ba36c89bc",
    dynamic_template_data: {
      sender,
      inviteUrl,
      teamName,
    },
  };
  sgMail
    .sendSingle(msg)
    .then(() => {
      console.log("Email sent");
      return { success: true };
    })
    .catch((error) => {
      console.error(error);
    });
}
