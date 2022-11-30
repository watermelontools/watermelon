import executeRequest from "../azuredb";

export default async function addEmailToGitHubQueryCountTable(userEmail): Promise<any> {
  try {
    let data = await executeRequest(
      `EXEC dbo.add_email_to_github_query_count_table @email = '${userEmail}'`
    );
    return data;
  } catch (err) {
    console.error(err);
    return err;
  }
}