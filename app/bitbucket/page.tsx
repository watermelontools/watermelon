import { getServerSession } from "next-auth";
//change this to import correctly
import saveUserInfo from "../../utils/db/bitbucket/saveUser";

import { authOptions } from "../api/auth/[...nextauth]/route";
import getAllPublicUserData from "../../utils/api/getAllUserPublicData";

import ConnectedService from "../../utils/services/page";
import LoginArray from "../../utils/services/loginArray";

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
  const serviceName = "Bitbucket";
  const [userData, serviceToken] = await Promise.all([
    getAllPublicUserData({ userEmail }).catch((e) => {
      console.error(e);
      return null;
    }),
    // change this fetch
    fetch(`https://bitbucket.org/site/oauth2/access_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=authorization_code&code=${code}&client_id=${process.env.BITBUCKET_CLIENT_ID}&client_secret=${process.env.BITBUCKET_CLIENT_SECRET}`,
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
    const headers = {
      Authorization: `Bearer ${json.access_token}`,
    };

    const requests = [
      fetch(`https://api.bitbucket.org/2.0/user`, { headers }),
      fetch(`https://api.bitbucket.org/2.0/user/permissions/workspaces`, {
        headers,
      }),
      fetch(`https://api.bitbucket.org/2.0/user/emails`, { headers }),
    ];

    let [user, workspace, email] = await Promise.all(requests);

    let userJson = await user.json();
    let workspaceJson = await workspace.json();
    let emailJson = await email.json();
    // save user correctly
    await saveUserInfo({
      access_token: json.access_token,
      refresh_token: json.refresh_token,
      id: userJson.account_id,
      avatar_url: userJson.links.avatar.href,
      watermelon_user: state,
      name: userJson.display_name,
      location: userJson.location,
      workspace: workspaceJson.values[0].workspace.slug,
      email: emailJson.values[0].email,
    });

    return (
      <ConnectedService
        serviceName={serviceName}
        displayName={userJson.display_name}
        teamName={workspaceJson.values[0].workspace.slug}
        avatarUrl={userJson.links.avatar.href}
        loginArray={loginArray}
        error={error}
      />
    );
  }
}
