import PageTitle from "../components/PageTitle";
function Login() {
  return (
    <>
      <PageTitle pageTitle="Login" />
      <div className="flex justify-center items-center h-screen w-full">
        <div className="rounded shadow p-4">
          <h1>Login</h1>
          <p>We need to know who you are to help you better.</p>
          <div className="w-full flex justify-center items-center my-2">
            <a
              href={`https://slack.com/oauth/v2/authorize?user_scope=identity.basic,identity.email,identity.team,identity.avatar&client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID
                }&redirect_uri=https://${process.env.NEXT_PUBLIC_IS_DEV === "true" ? "dev." : ""
                }app.watermelon.tools/firstAuth`}
            >
              <img
                alt="Sign in with Slack"
                height="40"
                width="172"
                src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
                srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
