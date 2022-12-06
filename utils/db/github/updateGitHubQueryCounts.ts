import executeRequest from "../azuredb";

export default async function updateGitHubQueryCounts(): Promise<any> {
  try {
    let data = await executeRequest(
      `EXEC dbo.update_github_query_counts`
    );
    return {data};
  } catch (err) {
    console.error(err);
    return err;
  }
}