import getJiraOrganization from "../../utils/db/jira/getOrganization";
import updateTokens from "../../utils/db/jira/updateTokens";
import updateTokensFromJira from "../../utils/jira/updateTokens";
async function getJira({
  user,
  title,
  body,
  jira_token,
  jira_refresh_token,
  randomWords,
}) {
  let jiraValue = {};
  if (jira_token !== null && jira_refresh_token !== null) {
    const newAccessTokens = await updateTokensFromJira({
      refresh_token: jira_refresh_token,
    });
    await updateTokens({
      access_token: newAccessTokens.access_token,
      refresh_token: newAccessTokens.refresh_token,
      user,
    });

    if (!user) {
      return { error: "no user" };
    }
    if (!newAccessTokens?.access_token) {
      return { error: "no access_token" };
    }

    const { jira_id } = await getJiraOrganization(user);
    if (!jira_id) {
      return { error: "no Jira cloudId" };
    }

    let returnVal = await fetch(
      `https://api.atlassian.com/ex/jira/${jira_id}/rest/api/3/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${newAccessTokens.access_token}`,
        },
        body: JSON.stringify({
          // ORDER BY issuetype ASC gives priority to bug tickets. If there are no bug tickets, it will still return stories
          // Sorting by description might be better than completely filtering out tickets without a description
          jql: `text ~ "${randomWords} OR ${title} OR ${body}" AND issuetype in (Bug, Story, Task, Sub-task, Epic) ORDER BY issuetype ASC, "Story Points" DESC, description DESC`,
          expand: ["renderedFields"],
        }),
      }
    )
      .then((res) => res.json())
      .then((resJson) => resJson.issues);
    const serverPromise = async () => {
      const serverInfo = await fetch(
        `https://api.atlassian.com/ex/jira/${jira_id}/rest/api/3/serverInfo`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",

            Authorization: `Bearer ${newAccessTokens.access_token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((resJson) => resJson);
      returnVal.forEach((element, index) => {
        returnVal[index].serverInfo = serverInfo;
      });
    };

    if (returnVal) {
      await Promise.allSettled([serverPromise()]);
    }
    jiraValue = returnVal;
  } else {
    jiraValue = { error: "no jira token" };
  }
  return jiraValue;
}
export default getJira;
