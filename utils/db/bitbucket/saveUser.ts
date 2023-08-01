import executeRequest from "../azuredb";

export default async ({
  access_token,
  id,
  avatar_url,
  watermelon_user,
  name,
  location,
  refresh_token,
  workspace,
  email,
}) => {
  let query = `EXEC dbo.create_bitbucket @watermelon_user='${watermelon_user}', @id='${id}', 
 @avatar_url='${avatar_url}', @name='${name}', @location='${location}', @access_token='${access_token}', @refresh_token='${refresh_token}',@workspace='${workspace}', @email='${email}';
 `;
  let resp = await executeRequest(query);
  return resp;
};
