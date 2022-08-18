import { supabase } from "../../supabase";
import executeRequest from "../azuredb";

export default async function updateTokens({
  user,
  access_token,
  refresh_token,
}: {
  user: string;
  access_token: string;
  refresh_token: string;
}): Promise<void> {
  let { data, error, status } = await supabase
    .from("Jira")
    .update({
      access_token,
      refresh_token,
    })
    .eq("user", user);
  if (error && status !== 406) {
    throw error;
  }
  let query = `EXEC dbo.update_jira_tokens  @user='${user}', @access_token='${access_token}', @refresh_token='${refresh_token}'`;
  let resp = await executeRequest(query);
  console.log("updateTokens", resp);
  return resp;
}
