import executeRequest from "../azuredb";

export default async ({
  access_token,
  refresh_token,
  jira_id,
  organization,
  url,
  org_avatar_url,
  scopes,
  user,
  user_email,
  user_avatar_url,
  user_id,
  user_displayname,
}) => {
  let query = `INSERT INTO [dbo].[jira] (access_token, refresh_token, jira_id, organization, url, org_avatar_url, scopes, user, user_email, user_avatar_url, user_id, user_displayname) VALUES ('${access_token}', '${refresh_token}', '${jira_id}', '${organization}', '${url}', '${org_avatar_url}', '${scopes}', '${user}', '${user_email}', '${user_avatar_url}', '${user_id}', '${user_displayname}')`;
  console.log(query);
  const queryString = JSON.stringify({ query: query });
  let resp = await executeRequest(queryString);
  console.log(resp);
  return resp;
};
