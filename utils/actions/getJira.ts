import getJiraOrganization from "../../utils/db/jira/getOrganization";
import getFreshJiraTokens from "../jira/getFreshJiraTokens";

function removeSpecialChars(inputString) {
  const specialChars = '!"#$%&/()=-_"{}¨*[]';
  return inputString
    .split("")
    .filter((char) => !specialChars.includes(char))
    .join("");
}

async function fetchJiraData(jql, jira_id, accessToken) {
  return fetch(
    `https://api.atlassian.com/ex/jira/${jira_id}/rest/api/3/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ jql, expand: ["renderedFields"] }),
    }
  )
    .then((res) => res.json())
    .then((resJson) => resJson.issues);
}

async function getJiraServerInfo(jira_id, accessToken) {
  return fetch(
    `https://api.atlassian.com/ex/jira/${jira_id}/rest/api/3/serverInfo`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then((res) => res.json());
}

async function getJira({
  user,
  jira_token,
  jira_refresh_token,
  randomWords,
  amount = 3,
}) {
  if (!jira_token || !jira_refresh_token) return { error: "no jira token" };
  if (!user) return { error: "no user" };

  const newAccessTokens = await getFreshJiraTokens({
    jira_refresh_token,
    user,
  });

  if (!newAccessTokens?.access_token) return { error: "no access_token" };

  const { jira_id } = await getJiraOrganization(user);
  if (!jira_id) return { error: "no Jira cloudId" };

  const cleanRandomWords = Array.from(
    new Set(randomWords.map((word) => removeSpecialChars(word)))
  );
  const summaryQuery = cleanRandomWords
    .map((word) => `summary ~ "${word}"`)
    .join(" OR ");
  const descriptionQuery = cleanRandomWords
    .map((word) => `description ~ "${word}"`)
    .join(" OR ");
  const jql = `(${summaryQuery}) OR (${descriptionQuery}) ORDER BY created DESC`;

  try {
    const results = await fetchJiraData(
      jql,
      jira_id,
      newAccessTokens.access_token
    );
    const serverInfo = await getJiraServerInfo(
      jira_id,
      newAccessTokens.access_token
    );
    results.forEach((element, index) => {
      results[index].serverInfo = serverInfo;
    });

    return results?.slice(0, amount);
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch data from Jira." };
  }
}

export default getJira;
