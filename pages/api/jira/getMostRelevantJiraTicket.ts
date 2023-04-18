import getJiraOrganization from "../../../utils/db/jira/getOrganization";
import getToken from "../../../utils/jira/refreshTokens";
// Remove stopwords to provide better search results
let stopwords = [
  "add",
  "get",
  "as",
  "at",
  "he",
  "the",
  "was",
  "from",
  "and",
  "or",
  "on",
  "for",
];

export default async function handler(req, res) {
  let { user, prTitle } = req.body;

  // parse pr_title
  const parsedPRTitle = prTitle
    ? prTitle
        .trim()
        .split(" ")
        .filter((word) => !stopwords.includes(word.toLowerCase()))
        .map((word) => word.replace(/:/g, "")) // Remove colons from words
        .join(" OR ")
    : "";

  const summaryQuery = parsedPRTitle.split(" OR ").map((word) => `summary ~ "${word}"`).join(" OR ");
  const descriptionQuery = parsedPRTitle.split(" OR ").map((word) => `description ~ "${word}"`).join(" OR ");

  if (!user) {
    return res.send({ error: "no user" });
  }

  let { access_token } = await getToken({ user });
  if (!access_token) {
    return res.send({ error: "no access_token" });
  }

  let { jira_id } = await getJiraOrganization(user);
  if (!jira_id) {
    return res.send({ error: "no Jira cloudId" });
  }

  let returnVal = await fetch(
    `https://api.atlassian.com/ex/jira/${jira_id}/rest/api/3/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        // ORDER BY issuetype ASC gives priority to bug tickets. If there are no bug tickets, it will still return stories
        // Sorting by description might be better than completely filtering out tickets without a description
        jql: `(${summaryQuery}) AND (${descriptionQuery}) ORDER BY created DESC`,
        expand: ["renderedFields"],
      }),
    }
  )
    .then((res) => res.json())
    .then((resJson) => resJson.issues);
  let serverPromise = async () => {
    let serverInfo = await fetch(
      `https://api.atlassian.com/ex/jira/${jira_id}/rest/api/3/serverInfo`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",

          Authorization: `Bearer ${access_token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((resJson) => resJson);
    returnVal.forEach((element, index) => {
      returnVal[index].serverInfo = serverInfo;
    });
  };

  let commentsPromises = returnVal?.map(async (element, index) => {
    returnVal[index].comments = [];
    return await fetch(
      `https://api.atlassian.com/ex/jira/${jira_id}/rest/api/3/issue/${element.key}/comment?expand=renderedBody`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((resJson) => {
        returnVal[index].comments.push(...resJson.comments);
        return resJson;
      });
  });
  if (returnVal) {
    await Promise.allSettled([...commentsPromises, serverPromise()]);
  }

  return res.send(returnVal);
}
