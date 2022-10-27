export default async function sendWelcome({
  emails,
  sender,
}: {
  emails: string[];
  sender: string;
}) {
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: emails,
    from: "edalel@watermelon.tools",
    templateId: "d-789789fdd54046659d75103ba36c89bc",
    dynamic_template_data: {
      sender,
    },
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
