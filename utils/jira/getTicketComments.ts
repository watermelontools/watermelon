var zlib = require("zlib");

export default async function getTicketComments({
  cloudId,
  access_token,
  issueIdOrKey,
}: {
  cloudId: string;
  access_token: string;
  issueIdOrKey: string;
}) {
  let returnVal;
  if (!cloudId) {
    return { error: "no cloudId" };
  }
  if (!access_token) {
    return { error: "no access_token" };
  }
  if (!issueIdOrKey) {
    return { error: "no issueIdOrKey" };
  }
  try {
    await fetch(
      `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${issueIdOrKey}/comment?expand=renderedBody`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Encoding": "deflate",
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((resJson) => {
        console.log(resJson);
        returnVal = resJson;
      });
    return returnVal;
  } catch (error) {
    console.error(error);
    return error;
  }
}
