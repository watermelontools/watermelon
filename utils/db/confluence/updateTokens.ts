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
      const query = `EXEC dbo.update_confluence_tokens  @user='${user}', @access_token='${access_token}', @refresh_token='${refresh_token}'`;
      let resp = await executeRequest(query);
      return resp;
    } else {
      throw new Error("User or tokens missing. Cannot update DB.");
    }
  } catch (error) {
    console.error("Error in updateTokens:", error);
    throw error; // propagate the error up for caller to handle if necessary
  }
}
