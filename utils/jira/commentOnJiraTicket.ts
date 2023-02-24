import fnTranslate from "md-to-adf";

export default async function handler({
  issueIdOrKey,
  text,
  access_token,
  cloudId,
}: {
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
  if (!issueIdOrKey) {
    return { error: "no issueIdOrKey" };
  }
  if (!text) {
    return { error: "no text" };
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
              text: "🍉 " + text,
              type: "text",
            },
          ],
        },
      ],
    },
  });
  console.log(fnTranslate(text));
  try {
    return await fetch(
      `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${issueIdOrKey}/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Encoding": "deflate",
          Accept: "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: bodyToSend,
      }
    ).then((res) => res.json());
  } catch (error) {
    console.error(error);
    return error;
  }
}
