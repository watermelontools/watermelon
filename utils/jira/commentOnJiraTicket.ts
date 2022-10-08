import getUserId from "./getUserId";

export default async function handler({
  user,
  issueIdOrKey,
  text,
  access_token,
  cloudId,
}: {
  user: string;
  issueIdOrKey: string;
  text: string;
  access_token: string;
  cloudId: string;
}) {
  if (!cloudId) {
    return { error: "no cloudId" };
  }
  if (!access_token) {
    return { error: "no access_token" };
  }
  let bodyToSend = JSON.stringify({
    body: {
      type: "doc",
      version: 1,
      content: [
        {
          type: "paragraph",
          content: [
            {
              text: "🍉" + text,
              type: "text",
            },
          ],
        },
      ],
    },
  });

  console.log(bodyToSend);
  try {
    await fetch(
      `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${issueIdOrKey}/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: bodyToSend,
      }
    )
      .then((res) => res.json())
      .then((resJson) => {
        console.log("resJson", resJson);
      });
  } catch (error) {
    console.error(error);
    return error;
  }
}
