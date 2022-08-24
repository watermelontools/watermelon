import executeRequest from "../azuredb";

export default async function getUser(user): Promise<any> {
  let data = await executeRequest(`EXEC dbo.get_jira_user @user = '${user}'`);

  return data;
}
