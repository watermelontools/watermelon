export default async function updateTokensFromConfluence({
  refresh_token,
}: {
  refresh_token: string;
}): Promise<{ access_token: string; refresh_token: string }> {
  try {
    const response = await fetch("https://auth.atlassian.com/oauth/token", {
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
    });

    // Check if the response is not OK before proceeding
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error while refreshing Confluence tokens:", errorText);
      throw new Error(
        `Failed to refresh tokens. HTTP Status: ${response.status}`
      );
    }

    const newAccessTokens = await response.json();
    return {
      access_token: newAccessTokens.access_token,
      refresh_token: newAccessTokens.refresh_token,
    };
  } catch (error) {
    console.error("Error in updateTokensFromConfluence:", error);
    throw error; // propagate the error up for caller to handle if necessary
  }
}
