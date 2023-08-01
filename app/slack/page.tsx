import { getServerSession } from "next-auth";
//change this to import correctly
import saveUserInfo from "../../utils/db/slack/saveUserInfo";

import { authOptions } from "../api/auth/[...nextauth]/route";
import getAllPublicUserData from "../../utils/api/getAllUserPublicData";
// the recommended services should not be of the same category as the current one
import LinearLoginLink from "../../components/LinearLoginLink";
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
  const serviceName = "Slack";
  const [userData, serviceToken] = await Promise.all([
    getAllPublicUserData({ userEmail }).catch((e) => {
      console.error(e);
      return null;
    }),
    // change this fetch
    fetch(`https://slack.com/api/oauth.v2.access`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=https://app.watermelontools.com/slack&client_id=${process.env.SLACK_CLIENT_ID}&client_secret=${process.env.SLACK_CLIENT_SECRET}`,
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
      name: "Linear",
      dataProp: "linear_data",
      loginComponent: <LinearLoginLink userEmail={userEmail} />,
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
    const { authed_user } = json;
    const userInfo = await fetch(
      `https://slack.com/api/users.info?user=${authed_user.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authed_user.access_token}`,
        },
      }
    );
    let userJson = await userInfo.json();
    // save user correctly
    await saveUserInfo({
      user_token: authed_user.access_token,
      bot_token: json.access_token,
      bot_user_id: json.bot_user_id,
      user_id: authed_user.id,
      team_id: json.team.id,
      team_name: json.team.name,
      bot_scopes: json.scope,
      user_scopes: authed_user.scope,
      incoming_webhook_channel_id: json.incoming_webhook.channel_id,
      watermelon_user: state,
      incoming_webhook_configuration_url:
        json.incoming_webhook.configuration_url,
      incoming_webhook_url: json.incoming_webhook.url,
      is_enterprise_install: json.is_enterprise_install,
      user_username: userJson.user.name,
      user_title: userJson.user.profile.title,
      user_real_name: userJson.user.real_name,
      user_picture_url: userJson.user.profile.image_512,
    });

    return (
      <ConnectedService
        serviceName={serviceName}
        displayName={userJson.user.name}
        teamName={json.team.name}
        avatarUrl={userJson.user.profile.image_512}
        loginArray={loginArray}
        error={error}
      />
    );
  }
}
