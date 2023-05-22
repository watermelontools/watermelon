import executeRequest from "../azuredb";

export default async ({ watermelon_user }) => {
  let query = await executeRequest(
    `EXEC dbo.increment_github_app_uses @watermelon_user = '${watermelon_user}'`
  );
  console.log("query", query);
  return query;
};
