import { getServerSession } from "next-auth";
//change this to import correctly
import saveUserInfo from "../../utils/db/linear/saveUser";

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
  const serviceName = "Linear";
  const [userData, serviceToken] = await Promise.all([
    getAllPublicUserData({ userEmail }).catch((e) => {
      console.error(e);
      return null;
    }),
    // change this fetch
    fetch(`https://api.linear.app/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: `grant_type=authorization_code&code=${code}&client_id=${process.env.LINEAR_CLIENT_ID}&client_secret=${process.env.LINEAR_CLIENT_SECRET}&redirect_uri=https://app.watermelontools.com/linear`,
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
    const graphql = JSON.stringify({
      query:
        "query Me {\nviewer {\n  id,\n  name,\n  displayName, email,\n  avatarUrl\n},\nteams {\n  nodes {\n    id,\n    name\n  }\n}\n}",
      variables: {},
    });
    // get user correctly
    let user = await fetch(`https://api.linear.app/graphql`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${json.access_token}`,
      },
      body: graphql,
    });
    let userText = await user.text();
    let userJson = JSON.parse(userText).data;
    // save user correctly
    await saveUserInfo({
      access_token: json.access_token,
      id: userJson.viewer.id,
      avatarUrl: userJson.viewer.avatarUrl,
      watermelon_user: state,
      displayName: userJson.viewer.displayName,
      name: userJson.viewer.name,
      email: state,
      team_id: userJson.teams.nodes[0].id,
      team_name: userJson.teams.nodes[0].name,
    });

    return (
      <ConnectedService
        serviceName={serviceName}
        displayName={userJson.viewer.displayName}
        teamName={userJson.teams.nodes[0].name}
        avatarUrl={userJson.viewer.avatarUrl}
        loginArray={loginArray}
        error={error}
      />
    );
  }
}
