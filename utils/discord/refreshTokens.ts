import updateTokens from "../db/discord/updateTokens";
import updateTokensFromDiscord from "./updateTokens";
import getAPIAccessInfo from "../db/discord/getAPIAccessInfo";

export default async ({ user }) => {
  try {
    let { refresh_token } = await getAPIAccessInfo(user);
    let newAccessTokens = await updateTokensFromDiscord({ refresh_token });
    await updateTokens({
      access_token: newAccessTokens.access_token,
      refresh_token: newAccessTokens.refresh_token,
      user,
    });
    return { access_token: newAccessTokens.access_token };
  } catch (error) {
    console.error(error);
    return error;
  }
};
