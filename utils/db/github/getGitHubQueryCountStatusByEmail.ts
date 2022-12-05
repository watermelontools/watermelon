import executeRequest from "../azuredb";

export default async function getGitHubQueryCountStatusByEmail(
  userEmail
): Promise<any> {
  try {
    let data = await executeRequest(
      `EXEC dbo.get_github_query_count_status_by_email @email = '${userEmail}'`
    );
    return data;
  } catch (err) {
    console.error(err);
    return err;
  }
}
