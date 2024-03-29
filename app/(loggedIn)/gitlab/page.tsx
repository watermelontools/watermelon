import { getServerSession } from "next-auth";
//change this to import correctly
import saveUserInfo from "../../../utils/db/gitlab/saveUser";

import { authOptions } from "../../api/auth/[...nextauth]/route";
import getAllPublicUserData from "../../../utils/api/getAllUserPublicData";

import ConnectedService from "../../../components/services/page";
import LoginArray from "../../../components/services/loginArray";

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
  const serviceName = "GitLab";
  const [userData, serviceToken] = await Promise.all([
    getAllPublicUserData({ email: userEmail }).catch((e) => {
      console.error(e);
      return null;
    }),
    // change this fetch
    fetch(`https://gitlab.com/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "https://app.watermelontools.com/gitlab",
        client_id: process.env.GITLAB_APP_ID,
        client_secret: process.env.GITLAB_CLIENT_SECRET,
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
    let user = await fetch(`https://gitlab.com/api/v4/user`, {
      headers: {
        Authorization: `Bearer ${json.access_token}`,
      },
    });
    let userJson = await user.json();
    // save user correctly
    await saveUserInfo({
      access_token: json.access_token,
      refresh_token: json.refresh_token,
      scope: json.scope,
      username: userJson.username,
      id: userJson.id,
      avatar_url: userJson.avatar_url,
      watermelon_user: state,
      name: userJson.name,
      organization: userJson.organization,
      website: userJson.website,
      email: userJson.email,
      location: userJson.location,
      bio: userJson.bio,
      twitter: userJson.twitter,
      linkedin: userJson.linkedin,
    });

    return (
      <ConnectedService
        serviceName={serviceName}
        displayName={userJson.username}
        teamName={userJson.organization}
        avatarUrl={userJson.avatar_url}
        loginArray={loginArray}
        error={error}
      />
    );
  }
}
