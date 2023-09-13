import executeRequest from "../azuredb";

export default async ({
  id,
  gid,
  name,
  email,
  access_token,
  refresh_token,
  avatar_url,
  workspace,
  workspace_name,
  watermelon_user,
}) => {
  let query = `EXEC dbo.create_asana @watermelon_user='${watermelon_user}', @id='${id}', 
 @avatar_url='${avatar_url}', @name='${name}', @location='${location}', @access_token='${access_token}', @refresh_token='${refresh_token}',@workspace='${workspace}',@workspace_name='${workspace_name}', @email='${email}', @gid = '${gid}';
 `;
  let resp = await executeRequest(query);
  return resp;
};
