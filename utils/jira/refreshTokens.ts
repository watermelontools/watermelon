import updateTokens from "./updateTokens";
import updateTokensFromJira from "./updateTokens";
import getAPIAccessInfo from "../db/jira/getAPIAccessInfo";

export default async ({ user }) => {
  try {
    let { refresh_token, access_token, cloudId } = await getAPIAccessInfo(user);
    let newAccessTokens = await updateTokensFromJira({
      refresh_token: refresh_token,
    });
    refresh_token = newAccessTokens.refresh_token;
    access_token = newAccessTokens.access_token;
    await updateTokens({ refresh_token });
    return { access_token, cloudId };
  } catch (error) {
    console.error(error);
    return error;
  }
};
