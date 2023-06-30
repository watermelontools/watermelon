import executeRequest from "../azuredb";

export default async ({ watermelon_user }) => {
  let query = await executeRequest(
    `EXEC dbo.get_user_teammates @watermelon_user = '${watermelon_user}'`
  );
  return query;
};
