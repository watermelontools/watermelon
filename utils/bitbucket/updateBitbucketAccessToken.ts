// This is the file that will get called everytime Bitbucket executes a request
import getRefreshToken from "../db/bitbucket/getRefreshToken";
import updateAccessTokenOnDB from "../db/bitbucket/updateAccessTokenOnDB";

export default async function updateBitbucketAccessToken(email): Promise<any> {
  try {
    // We get the refresh token for that user email from the DB
    let refreshToken = await getRefreshToken(email).then((res) => {
      return res.refresh_token;
    });

    // Then, we call Bitbucket's API to get a new access token
    const response = await fetch(
      "https://bitbucket.org/site/oauth2/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${process.env.BITBUCKET_CLIENT_ID}&client_secret=${process.env.BITBUCKET_CLIENT_SECRET}`,
      }
    );

    // And finally, we get the access token from the response, and call the stored procedure that updates the access_token for that user email on the DB
    const data = await response.json();
    const accessToken = data.access_token;
    await updateAccessTokenOnDB(email, accessToken);
    return accessToken;
  } catch (err) {
    console.error(err);
    return err;
  }
}
