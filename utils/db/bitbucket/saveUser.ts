import executeRequest from "../azuredb";

export default async ({
  access_token,
  login,
  id,
  avatar_url,
  scope,
  watermelon_user,
  name,
  company,
  blog,
  email,
  location,
  bio,
  twitter_username,
}) => {
  let query = `EXEC dbo.create_bitbucket @watermelon_user='${watermelon_user}', @login='${login}', @id='${id}', @avatar_url='${avatar_url}', @scope='${scope}', @name='${name}', @company='${company}', @blog='${blog}', @email='${email}', @location='${location}', @bio='${bio}', @twitter_username='${twitter_username}', @access_token='${access_token}'`;
  let resp = await executeRequest(query);
  return resp;
};
