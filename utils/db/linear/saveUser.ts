import executeRequest from "../azuredb";

export default async ({
  access_token,
  id,
  name,
  displayName,
  avatarUrl,
  email,
  watermelon_user,
  team_id,
  team_name,
}) => {
  let query = `EXEC dbo.create_linear @watermelon_user='${watermelon_user}', @id='${id}', 
 @avatarUrl='${avatarUrl}', @name='${name}',  @displayName='${displayName}', @team_id='${team_id}', @team_name='${team_name}', @access_token='${access_token}', @email='${email}';
 `;
  let resp = await executeRequest(query);
  return resp;
};
