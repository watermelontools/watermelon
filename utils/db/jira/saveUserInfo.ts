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
  let query = `EXEC dbo.create_jira @organization=${organization}, @jira_id=${jira_id}, @url=${url}, @org_avatar_url=${org_avatar_url}, @scopes=${scopes}, @user=${user}, @user_email=${user_email}, @user_avatar_url=${user_avatar_url}, @user_id=${user_id}, @user_displayname=${user_displayname}, @access_token=${access_token}, @refresh_token=${refresh_token}`;
  let resp = await executeRequest(query);
  return resp;
};
