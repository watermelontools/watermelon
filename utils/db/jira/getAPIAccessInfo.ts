import { supabase } from "../../supabase";
import executeRequest from "../azuredb";
export default async function getAPIAccessInfo(user: string): Promise<{
  access_token: string;
  refresh_token: string;
  cloudId: string;
}> {
  let query = `EXEC dbo.update_jira_tokens  @user='${user}'`;
  let resp = await executeRequest(query);
  console.log("updateTokens", resp);
  //return resp;
  let { data, error, status } = await supabase
    .from("Jira")
    .select("access_token, refresh_token, jira_id")
    .eq("user", user);
  if (error && status !== 406) {
    throw error;
  }
  if (!data || !data[0]) {
    throw new Error("no data");
  }
  return data[0];
}
