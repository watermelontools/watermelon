import Link from "next/link";
import { getServerSession } from "next-auth";
//change this to import correctly
import saveUserInfo from "../../utils/db/notion/saveUser";

import { authOptions } from "../api/auth/[...nextauth]/route";
import TimeToRedirect from "../../components/redirect";
import getAllPublicUserData from "../../utils/api/getAllUserPublicData";
// the recommended services should not be of the same category as the current one
import SlackLoginLink from "../../components/SlackLoginLink";
import JiraLoginLink from "../../components/JiraLoginLink";
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
  const serviceName = "Notion";
  const [userData, serviceToken] = await Promise.all([
    getAllPublicUserData({ userEmail }).catch((e) => {
      console.error(e);
      return null;
    }),
    // change this fetch
    fetch(`https://api.notion.com/v1/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic "${btoa(
          process.env.NOTION_CLIENT_ID + ":" + process.env.NOTION_CLIENT_SECRET
        )}"`,
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "https://app.watermelontools.com/notion",
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
      name: "Jira",
      dataProp: "jira_data",
      loginComponent: <JiraLoginLink userEmail={userEmail} />,
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
    let user = await fetch(
      `https://api.notion.com/v1/users/${json.owner.user.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${json.access_token}`,
          "Notion-Version": "2021-05-13",
        },
      }
    );
    let userJson = await user.json();
    // save user correctly
    await saveUserInfo({
      watermelon_user: state,
      access_token: json.access_token,
      token_type: json.token_type,
      bot_id: json.bot_id,
      workspace_name: json.workspace_name,
      workspace_icon: json.workspace_icon,
      workspace_id: json.workspace_id,
      owner_type: json.owner,
      owner_user_object: json.owner.user,
      owner_user_id: json.owner.user.id,
      duplicated_template_id: json.duplicated_template_id,
      user_id: userJson.id,
      user_name: userJson.name,
      user_avatar_url: userJson.avatar_url,
      user_email: userJson.person.email,
    });

    return (
      <ConnectedService
        serviceName={serviceName}
        displayName={userJson.name}
        teamName={json.workspace_name}
        avatarUrl={userJson.avatar_url}
        loginArray={loginArray}
        error={error}
      />
    );
  }
}
