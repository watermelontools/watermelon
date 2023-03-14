import getJiraOrganization from "../../../utils/db/jira/getOrganization";
import getJiraToken from "../../../utils/jira/refreshTokens";
import { Octokit } from "octokit";
import updateTokens from "../../../utils/db/jira/updateTokens";
import updateTokensFromJira from "../../../utils/jira/updateTokens";
import executeRequest from "../../../utils/db/azuredb";

export default async function handler(req, res) {
  const { user, prTitle, repo, owner, commitList } = req.body;
  console.log(req.body);
  const query = `EXEC dbo.get_all_tokens_from_gh_username @github_user='${user}'`;
  const resp = await executeRequest(query);
  const { github_token, jira_token, jira_refresh_token, slack_token, cloudId } =
    resp;
  console.log("resp: ", resp);
  const newAccessTokens = await updateTokensFromJira({
    refresh_token: jira_refresh_token,
  });
  console.log("newAccessTokens: ", newAccessTokens);
  await updateTokens({
    access_token: newAccessTokens.access_token,
    refresh_token: newAccessTokens.refresh_token,
    user,
  });
  console.log({
    access_token: newAccessTokens.access_token,
    cloudId,
  });
  const octokit = new Octokit({
    auth: github_token,
  });
  let q = `repo:${owner}/${repo}+hash:${commitList}`;

  let issues = await octokit.rest.search.issuesAndPullRequests({
    q,
    is: "pr",
    type: "pr",
  });
  let ghcommentsPromises = issues.data.items.map(
    async (issue, index) =>
      await octokit.rest.issues
        .listComments({
          owner,
          repo,
          issue_number: issue.number,
        })
        .then((comments) => {
          //@ts-ignore
          issues.data.items[index].comments = comments.data;
        })
  );
  await Promise.allSettled(ghcommentsPromises);
  /* // Remove stopwords to provide better search results
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

  let { access_token } = await getJiraToken({ user });
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
        jql: `text ~ "${parsedPRTitle}" AND issuetype in (Bug, Story, Task, Sub-task, Epic) ORDER BY issuetype ASC, "Story Points" DESC, description DESC`,
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
  let response = await searchMessageByText({
    text,
    user_token,
  });
  let repliesPromises = response.messages.matches.map(async (match, index) => {
    response.messages.matches[index].comments = [];
    let replies = await getConversationReplies({
      ts: match.ts,
      user_token: match.user_token,
      channelId: match.channel.id,
    });
    response.messages.matches[index].replies.push(...replies.messages);
  }); */
  return res.send(ghcommentsPromises);
}
