import executeRequest from "../azuredb";

export default async function getUser(user): Promise<any> {
  try {
    let data = await executeRequest(`EXEC dbo.get_jira_user @user = '${user}'`);
    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
}
