import executeRequest from "../azuredb";

export default async ({
  access_token,
  refresh_token,
  confluence_id,
  organization,
  url,
  org_avatar_url,
  scopes,
  watermelon_user,
  user_email,
  user_avatar_url,
  user_id,
  user_displayname,
}) => {
  let query = `EXEC dbo.create_confluence @organization='${organization}', @confluence_id='${confluence_id}', @url='${url}', @org_avatar_url='${org_avatar_url}', @watermelon_user='${watermelon_user}', @user_email='${user_email}', @user_avatar_url='${user_avatar_url}', @user_id='${user_id}', @user_displayname='${user_displayname}', @access_token='${access_token}', @refresh_token='${refresh_token}', @scopes='${scopes}'`;
  let resp = await executeRequest(query);
  return resp;
};
