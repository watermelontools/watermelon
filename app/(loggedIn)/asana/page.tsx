import { getServerSession } from "next-auth";
//change this to import correctly
import saveUserInfo from "../../../utils/db/asana/saveUser";

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
  const serviceName = "Asana";
  const [userData, serviceToken] = await Promise.all([
    getAllPublicUserData({ userEmail }).catch((e) => {
      console.error(e);
      return null;
    }),
    // change this fetch

    fetch(`https://app.asana.com/-/oauth_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: `grant_type=refresh_token&code=${code}redirect_uri=https://app.watermelontools.com/asana&client_id=${process.env.ASANA_CLIENT_ID}&client_secret=${process.env.ASANA_CLIENT_SECRET}`,
    }),
  ]);

  // the recommended services should not be of the same category as the current one
  const nameList = ["GitLab", "Slack", "Notion", "Confluence"];
  const loginArray = LoginArray({ nameList, userEmail, userData });

  const json = await serviceToken.json();
  if (json.error) {
    error = json.error;
  } else {
    // get user correctly
    let user = await fetch(
      `https://app.asana.com/api/1.0/users/me?opt_fields=photo.image_128x128,workspaces,workspaces.name,photo`,
      {
        headers: {
          Authorization: `Bearer ${json.access_token}`,
        },
      }
    );
    let userJson = await user.json();
    // save user correctly
    await saveUserInfo({
      id: json.data.id,
      gid: json.data.gid,
      name: json.data.name,
      email: json.data.email,
      access_token: json.access_token,
      refresh_token: json.refresh_token,
      avatar_url: userJson.photo.image_128x128,
      workspace: userJson.workspaces[0].gid,
      workspace_name: userJson.workspaces[0].name,
      watermelon_user: state,
    });

    return (
      <ConnectedService
        serviceName={serviceName}
        displayName={json.data.name}
        teamName={userJson.workspaces[0].name}
        avatarUrl={userJson.photo.image_128x128}
        loginArray={loginArray}
        error={error}
      />
    );
  }
}
