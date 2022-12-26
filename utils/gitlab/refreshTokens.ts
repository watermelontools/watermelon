import updateTokens from "../db/gitlab/updateTokens";
import updateTokensFromGitLab from "./updateTokens";
import getAPIAccessInfo from "../db/gitlab/getAPIAccessInfo";

export default async ({ user }) => {
  try {
    let { refresh_token } = await getAPIAccessInfo(user);
    let newAccessTokens = await updateTokensFromGitLab({ refresh_token });
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
