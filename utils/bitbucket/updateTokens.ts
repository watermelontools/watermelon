export default async function updateTokens({
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
            client_id: process.env.BITBUCKET_CLIENT_ID,
            client_secret: process.env.BITBUCKET_CLIENT_SECRET,
            refresh_token: access_token_to_refresh,
          }),
        }
      )
        .then((response) => response.json())
        .catch((error) => {
          console.error(error);
        });
      return {
        access_token: newAccessTokens.access_token,
        refresh_token: newAccessTokens.refresh_token,
      };
    } catch (error) {
      console.error(error);
      return error;
    }
  }
  