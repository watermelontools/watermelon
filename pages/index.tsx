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
  console.log(json);
  if (json.error)
    return {
      props: {
        error: json.error,
      },
    };
  return {
    props: {
      accessToken: json.access_token,
    },
  };
}
