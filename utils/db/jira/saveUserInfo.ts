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
  let query = `INSERT INTO watermelon.dbo.jira (access_token,refresh_token,jira_id,organization,url,org_avatar_url,scopes,[user],user_email,user_avatar_url,user_id,user_displayname) VALUES ('${access_token}','${refresh_token}','${jira_id}','${organization}','${url}','${org_avatar_url}','${scopes}','${user}','${user_email}','${user_avatar_url}','${user_id}','${user_displayname}') OUTPUT INSERTED.* FOR JSON PATH`;
  let resp = await executeRequest(query);
  return resp;
};
