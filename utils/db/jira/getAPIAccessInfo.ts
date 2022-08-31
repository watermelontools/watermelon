import executeRequest from "../azuredb";
export default async function getAPIAccessInfo(user: string): Promise<{
  access_token: string;
  refresh_token: string;
  cloudId: string;
}> {
  try {
    let query = `EXEC dbo.get_jira_tokens @user='${user}'`;
    let resp = await executeRequest(query);
    return resp;
  } catch (error) {
    console.error(error);
    return error;
  }
}
