import { getServerSession } from "next-auth";
//change this to import correctly
import saveUserInfo from "../../utils/db/github/saveUser";

import { authOptions } from "../api/auth/[...nextauth]/route";
import getAllPublicUserData from "../../utils/api/getAllUserPublicData";
// the recommended services should not be of the same category as the current one
import SlackLoginLink from "../../components/SlackLoginLink";
import NotionLoginLink from "../../components/NotionLoginLink";
import ConfluenceLoginLink from "../../components/ConfluenceLoginLink";
import JiraLoginLink from "../../components/JiraLoginLink";
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
  const serviceName = "GitHub";
  const [userData, serviceToken] = await Promise.all([
    getAllPublicUserData({ userEmail }).catch((e) => {
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
  const services = [
    {
      name: "Jira",
      dataProp: "jira_data",
      loginComponent: <JiraLoginLink userEmail={userEmail} />,
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
    let user = await fetch(`https://api.github.com/user`, {
      headers: {
        Authorization: `token ${json.access_token}`,
      },
    });
    let userJson = await user.json();
    // save user correctly
    await saveUserInfo({
      access_token: json.access_token,
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
