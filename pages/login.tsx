import PageTitle from "../components/PageTitle";
import { useEffect, useState } from "react";
function Login() {
  const localeTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    const script = document.createElement('script');
  
    script.src = "https://cdn.rawgit.com/oauth-io/oauth-js/c5af4519/dist/oauth.js";
    script.async = true;
  
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const onGitHubClick = () => {
    OAuth.initialize('VZ0GP42DGRn7t30wPt-xp90Q5DM');
    // Use popup for OAuth
    OAuth.popup('github').then(github => {
      console.log(github);
      // Retrieves user data from oauth provider
      console.log("github.me")
      console.log(github.me());
    });
  }

  return (
    <>
      <PageTitle pageTitle="Login" />
      <div
        className="flex justify-center items-center h-screen w-full"
        style={{ backgroundImage: "url(bg-pink.png)", backgroundSize: "cover" }}>
        <div className="rounded shadow p-4 bg-white">
          <h1>Login</h1>
          <p>We need to know who you are to help you better.</p>
          <div className="w-full flex justify-center items-center my-2">
            {/* <a
              href={`https://slack.com/oauth/v2/authorize?user_scope=identity.basic,identity.email,identity.team,identity.avatar&client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID
                }&redirect_uri=https://${process.env.IS_DEV == "true" ? process.env.NEXT_PUBLIC_VERCEL_URL : "app.watermelon.tools"}/firstAuth`}
            >
              <img
                alt="Sign in with Slack"
                height="40"
                width="172"
                src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
                srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
              />
            </a> */}

            
                            <a id="github-button" className="btn btn-block btn-social btn-github" onClick={() => onGitHubClick()}>
                  <i className="fa fa-github"></i> Sign in with Github
                </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
