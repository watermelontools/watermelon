import { getServerSession } from "next-auth";
//change this to import correctly
import saveUserInfo from "../../../utils/db/github/saveUser";

import { authOptions } from "../../api/auth/[...nextauth]/route";
import getAllPublicUserData from "../../../utils/api/getAllUserPublicData";

import ConnectedService from "../../../components/services/page";
import LoginArray from "../../../components/services/loginArray";

import { encrypt, decrypt } from "../../../utils/encryption/tokenSalting";

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
  const serviceName = "GitHub";
  const [userData, serviceToken] = await Promise.all([
    getAllPublicUserData({ email: userEmail }).catch((e) => {
      console.error(e);
      return null;
    }),
    // change this fetch
    fetch(`https://github.com/login/oauth/access_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "https://app.watermelontools.com/github",
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
      }),
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
    let user = await fetch(`https://api.github.com/user`, {
      headers: {
        Authorization: `token ${decrypt(json.access_token)}`,
      },
    });
    let userJson = await user.json();
    // save user correctly
    await saveUserInfo({
      access_token: encrypt(json.access_token),
      scope: json.scope,
      login: userJson.login,
      id: userJson.id,
      avatar_url: userJson.avatar_url,
      watermelon_user: state,
      name: userJson.name,
      company: userJson.company,
      blog: userJson.blog,
      email: userJson.email,
      location: userJson.location,
      bio: userJson.bio,
      twitter_username: userJson.twitter_username,
    });

    return (
      <ConnectedService
        serviceName={serviceName}
        displayName={userJson.login}
        teamName={userJson.login}
        avatarUrl={userJson.avatar_url}
        loginArray={loginArray}
        error={error}
      />
    );
  }
}
