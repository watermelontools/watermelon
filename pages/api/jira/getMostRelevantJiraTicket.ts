import getJiraOrganization from "../../../utils/db/jira/getOrganization";
import getToken from "../../../utils/jira/refreshTokens";

export default async function handler(req, res) {
  let { user, prTitle } = req.body;

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

  // parse pr_title
  let parsedPRTitle = "";

  if (prTitle) {
    parsedPRTitle = prTitle
      .trim()
      .split(" ")
      .filter((word) => !stopwords.includes(word.toLowerCase()))
      .join(" ")
      .split(" ")
      .join(" OR ");
  }

  if (!user) {
    return res.send({ error: "no user" });
  }

  let { access_token } = await getToken({ user });
  if (!access_token) {
    res.send({ error: "no access_token" });
  }

  let { jira_id, user_email } = await getJiraOrganization(user);
  if (!jira_id) {
    res.send({ error: "no Jira cloudId" });
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
        jql: `text ~ "${parsedPRTitle}" AND issuetype in (Bug, Story, Task, Sub-task, Epic) ORDER BY issuetype ASC, "Story Points" DESC, description DESC`,
        expand: ["renderedFields"],
      }),
    }
  )
    .then((res) => res.json())
    .then((resJson) => resJson.issues);
  return res.send(returnVal);
}
