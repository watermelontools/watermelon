import { getServerSession } from "next-auth";
//change this to import correctly
import saveUserInfo from "../../utils/db/discord/saveUser";

import { authOptions } from "../api/auth/[...nextauth]/route";
import getAllPublicUserData from "../../utils/api/getAllUserPublicData";

import ConnectedService from "../../components/services/page";
import LoginArray from "../../components/services/loginArray";

export default async function ServicePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const userName = session?.user?.name;
  const { code, state } = searchParams;
  let error = "";
  // change service name
  const serviceName = "Discord";
  const [userData, serviceToken] = await Promise.all([
    getAllPublicUserData({ userEmail }).catch((e) => {
      console.error(e);
      return null;
    }),
    // change this fetch
    fetch(`https://discord.com/api/v10/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(
        {
          client_id: process.env.DISCORD_CLIENT_ID,
          client_secret: process.env.DISCORD_CLIENT_SECRET,
          grant_type: "authorization_code",
          code: code,
          redirect_uri: "https://app.watermelontools.com/discord",
        }.toString()
      ),
    }),
  ]);

  // the recommended services should not be of the same category as the current one
  const nameList = ["Jira", "Slack", "Notion", "Confluence"];
  const loginArray = LoginArray({ nameList, userEmail, userData });

  const json = await serviceToken.json();
  if (json.error) {
    error = json.error;
  } else {
    // get user correctly
    const json = await serviceToken.json();
    const user = await fetch(`https://discord.com/api/v10/users/@me`, {
      headers: {
        Authorization: `Bearer ${json.access_token}`,
      },
    });
    let userJson = await user.json();
    // save user correctly
    await saveUserInfo({
      access_token: json.access_token,
      scope: json.scope,
      username: userJson.username,
      id: userJson.id,
      avatar_url: userJson.avatar,
      watermelon_user: state,
      email: userJson.email,
      refresh_token: json.refresh_token,
    });

    return (
      <ConnectedService
        serviceName={serviceName}
        displayName={"discord"}
        teamName={userJson.login}
        avatarUrl={userJson.avatar}
        loginArray={loginArray}
        error={error}
      />
    );
  }
}
