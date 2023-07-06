import executeRequest from "../azuredb";

export default async ({ watermelon_user }) => {
  let query = await executeRequest(
    `EXEC dbo.get_user_team @watermelon_user = '${watermelon_user}'`
  );
  return query;
};
