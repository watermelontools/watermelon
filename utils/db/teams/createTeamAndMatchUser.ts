import executeRequest from "../azuredb";

export default async ({ name, id, watermelon_user }) => {
  let query = await executeRequest(
    `EXEC dbo.create_new_team_and_match_user @name = '${name}', @id = '${id}', @user_id = '${watermelon_user}'`
  );
  return query;
};
