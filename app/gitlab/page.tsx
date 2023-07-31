import Link from "next/link";
import { getServerSession } from "next-auth";

import saveUserInfo from "../../utils/db/gitlab/saveUser";

import { authOptions } from "../api/auth/[...nextauth]/route";
import TimeToRedirect from "../../components/redirect";
import getAllPublicUserData from "../../utils/api/getAllUserPublicData";

import SlackLoginLink from "../../components/SlackLoginLink";
import NotionLoginLink from "../../components/NotionLoginLink";
import ConfluenceLoginLink from "../../components/ConfluenceLoginLink";
import JiraLoginLink from "../../components/JiraLoginLink";

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
  const serviceName = "GitLab";
  const [userData, serviceToken] = await Promise.all([
    getAllPublicUserData({ userEmail }).catch((e) => {
      console.error(e);
      return null;
    }),
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
    let user = await fetch(`https://gitlab.com/api/v4/user`, {
      headers: {
        Authorization: `Bearer ${json.access_token}`,
      },
    });
    let userJson = await user.json();

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
      <div className="Box" style={{ maxWidth: "100ch", margin: "auto" }}>
        <div className="Subhead">
          <h2 className="Subhead-heading px-2">
            You have logged in with {serviceName} as{" "}
            {userJson.viewer.displayName} in the team{" "}
            {userJson.teams.nodes[0].name}
          </h2>
        </div>
        <img
          src={userJson.viewer.avatarUrl}
          alt="linear user image"
          className="avatar avatar-8"
        />
        <div>
          <TimeToRedirect url={"/"} />
          <p>
            If you are not redirected, please click <Link href="/">here</Link>
          </p>
          {loginArray.length ? (
            <div>
              <h3>You might also be interested: </h3>
              {loginArray.map((login) => (
                <>{login}</>
              ))}
            </div>
          ) : null}
          {error && <p>{error}</p>}
        </div>
      </div>
    );
  }
}
