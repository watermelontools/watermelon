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
  try {
    if (user && access_token && refresh_token) {
      let query = `EXEC dbo.update_discord_tokens  @user='${user}', @access_token='${access_token}', @refresh_token='${refresh_token}'`;
      let resp = await executeRequest(query);
      return resp;
    }
  } catch (error) {
    console.error(error);
    return error;
  }
}
