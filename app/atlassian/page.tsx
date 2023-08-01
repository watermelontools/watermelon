import { getServerSession } from "next-auth";
//change this to import correctly
import saveJiraUserInfo from "../../utils/db/jira/saveUserInfo";
import saveConfluenceUserInfo from "../../utils/db/confluence/saveUserInfo";
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
  searchParams: { [key: string]: string | undefined };
}) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const userName = session?.user?.name;
  const { code, state } = searchParams;
  let isConfluence = state?.startsWith("c");

  let error = "";
  // change service name
  const serviceName = isConfluence ? "Confluence" : "Jira";
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
        redirect_uri: "https://app.watermelontools.com/atlassian",
        client_id: process.env.NEXT_PUBLIC_JIRA_CLIENT_ID,
        client_secret: process.env.JIRA_CLIENT_SECRET,
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
  let userInfoJson;
  if (json.error) {
    error = json.error;
  } else {
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
    if (isConfluence) {
      const userInfo = await fetch(
        `https://api.atlassian.com/ex/confluence/${orgInfoJson[0].id}/rest/api/user/current`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      userInfoJson = await userInfo.json();
      await saveConfluenceUserInfo({
        access_token: json.access_token,
        refresh_token: json.refresh_token,
        confluence_id: orgInfoJson[0].id,
        organization: orgInfoJson[0].name,
        url: orgInfoJson[0].url,
        org_avatar_url: orgInfoJson[0].avatarUrl,
        scopes: orgInfoJson[0].scopes,
        watermelon_user: state?.slice(1),
        user_email: userInfoJson.email,
        user_avatar_url:
          orgInfoJson[0].url + userInfoJson?.profilePicture?.path,
        user_id: userInfoJson.accountId,
        user_displayname: userInfoJson.displayName,
      });
    } else {
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
      userInfoJson = await userInfo.json();
      await saveJiraUserInfo({
        access_token: json.access_token,
        refresh_token: json.refresh_token,
        jira_id: orgInfoJson[0].id,
        organization: orgInfoJson[0].name,
        url: orgInfoJson[0].url,
        org_avatar_url: orgInfoJson[0].avatarUrl,
        scopes: orgInfoJson[0].scopes,
        watermelon_user: state?.slice(1),
        user_email: userInfoJson.emailAddress,
        user_avatar_url: userInfoJson?.avatarUrls?.["48x48"],
        user_id: userInfoJson.accountId,
        user_displayname: userInfoJson.displayName,
      });
    }

    return (
      <ConnectedService
        serviceName={serviceName}
        displayName={userInfoJson.displayName}
        teamName={orgInfoJson[0].name}
        avatarUrl={
          isConfluence
            ? orgInfoJson[0].url + userInfoJson?.profilePicture?.path
            : userInfoJson?.avatarUrls?.["48x48"]
        }
        loginArray={loginArray}
        error={error}
      />
    );
  }
}
