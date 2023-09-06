import updateTokens from "../db/jira/updateTokens";
import updateTokensFromJira from "./updateTokens";
import getAPIAccessInfo from "../db/jira/getAPIAccessInfo";

export default async ({ user }) => {
  try {
    // as stated in the atlassian docs, we need to refresh the access token every use
    // https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/#how-do-i-get-a-new-access-token--if-my-access-token-expires-or-is-revoked-
    // the refresh token, once used needs to be refreshed too
    let { refresh_token, cloudId } = await getAPIAccessInfo(user);
    let newAccessTokens = await updateTokensFromJira({ refresh_token });
    await updateTokens({
      access_token: newAccessTokens.access_token,
      refresh_token: newAccessTokens.refresh_token,
      user,
    });
    return { access_token: newAccessTokens.access_token, cloudId };
  } catch (error) {
    console.error(error);
    return error;
  }
};
