import executeRequest from "../azuredb";

export default async ({
  access_token,
  refresh_token,
  username,
  id,
  avatar_url,
  scope,
  watermelon_user,
  name,
  organization,
  website,
  email,
  location,
  bio,
  twitter,
  linkedin
}) => {
  let query = `EXEC dbo.create_gitlab @watermelon_user='${watermelon_user}', @username='${username}', @id='${id}', @avatar_url='${avatar_url}', @scope='${scope}', @name='${name}', @organization='${organization}', @website='${website}', @email='${email}', @location='${location}', @bio='${bio}', @twitter='${twitter}', @linkedin='${linkedin}', @access_token='${access_token}, @refresh_token='${refresh_token}'`;
  let resp = await executeRequest(query);
  return resp;
};
