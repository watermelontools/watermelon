import executeRequest from "../azuredb";
export default async function getAPIAccessInfo(user: string): Promise<{
  access_token: string;
  refresh_token: string;
}> {
  try {
    console.log("getAPIAccessInfo");
    let query = `EXEC dbo.get_gitlab_tokens @user='${user}'`;
    console.log("query", query);
    let resp = await executeRequest(query);
    console.log("resp", resp);
    return resp;
  } catch (error) {
    console.error(error);
    return error;
  }
}
