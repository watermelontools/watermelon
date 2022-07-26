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
  if (json.error)
    return {
      props: {
        error: json.error,
      },
    };
  supabase.from("Jira").insert({
    access_token: json.access_token,
    jira_id: json.id,
    organization: json.name,
    url: json.url,
    avatar_url: json.avatarUrl,
    scopes: json.scopes,
  });

  return {
    props: {
      accessToken: json.access_token ? true : false,
    },
  };
}
