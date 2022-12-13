import executeRequest from "../azuredb";

export default async function addToGitHubQueryCount(userEmail): Promise<any> {
  try {
    let data = await executeRequest(
      `EXEC dbo.add_to_git_query_count @email = '${userEmail}'`
    );
    return data;
  } catch (err) {
    console.error(err);
    return err;
  }
}