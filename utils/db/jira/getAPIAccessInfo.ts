import { supabase } from "../../supabase";
import executeRequest from "../azuredb";
export default async function getAPIAccessInfo(user: string): Promise<{
  access_token: string;
  refresh_token: string;
  cloudId: string;
}> {
  let query = `EXEC dbo.get_jira_tokens  @user='${user}'`;
  let resp = await executeRequest(query);
  console.log("updateTokens", resp);
  return resp;
}
