import Link from "next/link";
import saveUserInfo from "../../utils/db/linear/saveUser";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
async function Linear({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const userName = session?.user?.name;
  const { code, state } = searchParams;
  let timeToRedirect = 10;
  let error = "";
  setInterval(() => {
    timeToRedirect = timeToRedirect - 1;
    if (timeToRedirect === 0) {
      redirect("/");
    }
  }, 1000);
  let f;
  if (code) {
    f = await fetch(`https://api.linear.app/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: `grant_type=authorization_code&code=${code}&client_id=${process.env.LINEAR_CLIENT_ID}&client_secret=${process.env.LINEAR_CLIENT_SECRET}&redirect_uri=https://app.watermelontools.com/linear`,
    });
  } else {
    error = "no code";
  }
  const json = await f.json();
  if (json.error) {
    error = json.error;
  } else {
    const graphql = JSON.stringify({
      query:
        "query Me {\nviewer {\n  id,\n  name,\n  displayName, email,\n  avatarUrl\n},\nteams {\n  nodes {\n    id,\n    name\n  }\n}\n}",
      variables: {},
    });
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
      <div className="Box" style={{ maxWidth: "100ch", margin: "auto" }}>
        <div className="Subhead">
          <h2 className="Subhead-heading px-2">
            You have logged in with Linear as {userJson.viewer.displayName} in
            the team {userJson.teams.nodes[0].name}
          </h2>
        </div>
        <img
          src={userJson.viewer.avatarUrl}
          alt="linear user image"
          className="avatar avatar-8"
        />
        <div>
          <p>You will be redirected in {timeToRedirect}...</p>
          <p>
            If you are not redirected, please click <Link href="/">here</Link>
          </p>
          {error && <p>{error}</p>}
        </div>
      </div>
    );
  }
}
