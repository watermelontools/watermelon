import executeRequest from "../azuredb";

export default async ({
  access_token,
  refresh_token,
  login,
  id,
  avatar_url,
  scope,
  watermelon_user,
  email,
}) => {
  let query = `EXEC dbo.create_discord @watermelon_user='${watermelon_user}', @login='${login}', @id='${id}', @avatar_url='${avatar_url}', @scope='${scope}', @email='${email}', @access_token='${access_token}', @refresh_token='${refresh_token}'`;
  let resp = await executeRequest(query);
  return resp;
};
