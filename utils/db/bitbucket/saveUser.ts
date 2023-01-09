import executeRequest from "../azuredb";

export default async ({
  access_token,
  id,
  avatar_url,
  watermelon_user,
  name,
  location,
  refresh_token,
}) => {
  let query = `EXEC dbo.create_bitbucket @watermelon_user='${watermelon_user}', @id='${id}', 
 @avatar_url='${avatar_url}', @name='${name}', @location='${location}', @access_token='${access_token}', @refresh_token='${refresh_token};
 `;
  let resp = await executeRequest(query);
  return resp;
};
