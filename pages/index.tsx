import { supabase } from "../utils/supabase";

function HomePage() {
  return <div>Home</div>;
}

export default HomePage;
export async function getServerSideProps(context) {
  let f;
  if (context.query.code) {
    console.log(context.query.code);
    f = await fetch(`https://auth.atlassian.com/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: context.query.code,
        redirect_uri: "https://app.watermelon.tools",
        client_id: process.env.NEXT_PUBLIC_JIRA_CLIENT_ID,
        client_secret: process.env.JIRA_CLIENT_SECRET,
      }),
    });
  } else
    return {
      props: {
        error: "no code",
      },
    };
  const json = await f.json();
  if (json.error) {
    return {
      props: {
        error: json.error,
      },
    };
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
    let { data, error, status } = await supabase.from("Jira").insert({
      access_token: json.access_token,
      jira_id: orgInfoJson.id,
      organization: orgInfoJson.name,
      url: orgInfoJson.url,
      avatar_url: orgInfoJson.avatarUrl,
      scopes: orgInfoJson.scopes,
    });
    if (error) {
      console.error(error);
    } else {
      console.log(data);
    }
    return {
      props: {
        organization: orgInfoJson?.name,
      },
    };
  }
}
