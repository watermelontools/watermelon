import { getServerSession } from "next-auth";
//change this to import correctly
import saveUserInfo from "../../utils/db/jira/saveUserInfo";

import { authOptions } from "../api/auth/[...nextauth]/route";
import getAllPublicUserData from "../../utils/api/getAllUserPublicData";
// the recommended services should not be of the same category as the current one
import SlackLoginLink from "../../components/SlackLoginLink";
import NotionLoginLink from "../../components/NotionLoginLink";
import ConfluenceLoginLink from "../../components/ConfluenceLoginLink";
import GitHubLoginLink from "../../components/GitHubLoginLink";
import ConnectedService from "../../utils/services/page";

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
  const serviceName = "Jira";
  const [userData, serviceToken] = await Promise.all([
    getAllPublicUserData({ userEmail }).catch((e) => {
      console.error(e);
      return null;
    }),
    // change this fetch
    fetch(`https://auth.atlassian.com/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "https://app.watermelontools.com/jira",
        client_id: process.env.NEXT_PUBLIC_JIRA_CLIENT_ID,
        client_secret: process.env.JIRA_CLIENT_SECRET,
      }),
    }),
  ]);

  // the recommended services should not be of the same category as the current one
  const services = [
    {
      name: "GitHub",
      dataProp: "github_data",
      loginComponent: <GitHubLoginLink userEmail={userEmail} />,
    },
    {
      name: "Slack",
      dataProp: "slack_data",
      loginComponent: <SlackLoginLink userEmail={userEmail} />,
    },
    {
      name: "Confluence",
      dataProp: "confluence_data",
      loginComponent: <ConfluenceLoginLink userEmail={userEmail} />,
    },
    {
      name: "Notion",
      dataProp: "notion_data",
      loginComponent: <NotionLoginLink userEmail={userEmail} />,
    },
  ];
  const loginArray = services
    .map((service) =>
      userData?.[service.dataProp] ? null : service.loginComponent
    )
    .filter((component) => component !== null);

  const json = await serviceToken.json();
  if (json.error) {
    error = json.error;
  } else {
    // get user correctly
    const { access_token } = json;
    const orgInfo = await fetch(
      "https://api.atlassian.com/oauth/token/accessible-resources",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const orgInfoJson = await orgInfo.json();
    const userInfo = await fetch(
      `https://api.atlassian.com/ex/jira/${orgInfoJson[0].id}/rest/api/3/myself`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const userInfoJson = await userInfo.json();
    // save user correctly
    await saveUserInfo({
      access_token: json.access_token,
      refresh_token: json.refresh_token,
      jira_id: orgInfoJson[0].id,
      organization: orgInfoJson[0].name,
      url: orgInfoJson[0].url,
      org_avatar_url: orgInfoJson[0].avatarUrl,
      scopes: orgInfoJson[0].scopes,
      watermelon_user: state,
      user_email: userInfoJson.emailAddress,
      user_avatar_url: userInfoJson.avatarUrls["48x48"],
      user_id: userInfoJson.accountId,
      user_displayname: userInfoJson.displayName,
    });

    return (
      <ConnectedService
        serviceName={serviceName}
        displayName={userInfoJson.displayName}
        teamName={orgInfoJson[0].name}
        avatarUrl={userInfoJson.avatarUrls["48x48"]}
        loginArray={loginArray}
        error={error}
      />
    );
  }
}
