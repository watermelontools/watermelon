import executeRequest from "../db/azuredb";

async function updateTokensInDB({
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
      let query = `EXEC dbo.update_confluence_tokens  @user='${user}', @access_token='${access_token}', @refresh_token='${refresh_token}'`;
      let resp = await executeRequest(query);
      return resp;
    }
  } catch (error) {
    console.error(error);
    return error;
  }
}

async function updateTokensFromConfluence({
  refresh_token,
}: {
  refresh_token: string;
}): Promise<{ access_token: string; refresh_token: string }> {
  try {
    let newAccessTokens = await fetch(
      "https://auth.atlassian.com/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "refresh_token",
          client_id: process.env.NEXT_PUBLIC_JIRA_CLIENT_ID,
          client_secret: process.env.JIRA_CLIENT_SECRET,
          refresh_token: refresh_token,
        }),
      }
    )
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
      });
    console.log("newAccessTokens", newAccessTokens);
    return {
      access_token: newAccessTokens.access_token,
      refresh_token: newAccessTokens.refresh_token,
    };
  } catch (error) {
    console.error(error);
    return error;
  }
}

async function getFreshConfluenceTokens({ confluence_refresh_token, user }) {
  const newAccessTokens = await updateTokensFromConfluence({
    refresh_token: confluence_refresh_token,
  });

  if (!newAccessTokens?.access_token) {
    throw new Error("Failed to fetch a new access token from Confluence.");
  }

  await updateTokensInDB({
    access_token: newAccessTokens.access_token,
    refresh_token: newAccessTokens.refresh_token,
    user,
  });

  return newAccessTokens;
}

export default getFreshConfluenceTokens;
