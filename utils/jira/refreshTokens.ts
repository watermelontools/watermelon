import updateTokens from "../db/jira/updateTokens";
import updateTokensFromJira from "./updateTokens";
import getAPIAccessInfo from "../db/jira/getAPIAccessInfo";

export default async ({ user }) => {
  try {
    let { refresh_token, cloudId } = await getAPIAccessInfo(user);
    let newAccessTokens = await updateTokensFromJira({ refresh_token });
    console.log("newAccessTokens", newAccessTokens);
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
