import executeRequest from "../azuredb";

export default async function deactivateGitHubQueryCountPaymentStatus(
  userEmail
): Promise<any> {
  try {
    let data = await executeRequest(
      `EXEC dbo.deactivate_git_query_count_payment_status @email = '${userEmail}'`
    );
    return data;
  } catch (err) {
    console.error(err);
    return err;
  }
}
