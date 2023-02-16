import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import getJiraInfo from "../utils/api/getJiraInfo";
import getGitHubInfo from "../utils/api/getGitHubInfo";
import getSlackInfo from "../utils/api/getSlackInfo";
import getBitbucketInfo from "../utils/api/getBitbucketInfo";
import getGitLabInfo from "../utils/api/getGitLabInfo";
import getPaymentInfo from "../utils/api/getPaymentInfo";
import InfoPanel from "../components/dashboard/InfoPanel";
import JiraLoginLink from "../components/JiraLoginLink";
import SlackLoginLink from "../components/SlackLoginLink";
import GitHubLoginLink from "../components/GitHubLoginLink";
import GitLabLoginLink from "../components/GitLabLoginLink";
import BitbucketLoginLink from "../components/BitbucketLoginLink";
function VSCodium({}) {
  const { status, data } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });
  const [timeToRedirect, setTimeToRedirect] = useState(10);
  const [userEmail, setUserEmail] = useState(null);

  const [jiraUserData, setJiraUserData] = useState(null);
  const [githubUserData, setGithubUserData] = useState(null);
  const [bitbucketUserData, setBitbucketUserData] = useState(null);
  const [gitlabUserData, setGitlabUserData] = useState(null);
  const [slackUserData, setSlackUserData] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  useEffect(() => {
    setUserEmail(data?.user?.email);
  }, [data]);
  useEffect(() => {
    if (userEmail) {
      getJiraInfo(userEmail).then((data) => {
        setJiraUserData(data);
      });
      getGitHubInfo(userEmail).then((data) => {
        setGithubUserData(data);
      });
      getSlackInfo(userEmail).then((data) => {
        setSlackUserData(data);
      });
      getBitbucketInfo(userEmail).then((data) => {
        setBitbucketUserData(data);
      });
      getGitLabInfo(userEmail).then((data) => {
        setGitlabUserData(data);
      });
      // use getByEmail to check if user has paid
      // TODO: As stated on Jira ticket WM-66, we'll refactor this later in order to not block render
      // and have a perfect self-serve experience
      getPaymentInfo(userEmail).then((data) => {
        setHasPaid(data);
      });
    }
  }, [userEmail]);
  let system = "vscode";
  let url: string = `${system}://watermelontools.watermelon-tools?email=${
    userEmail ?? ""
  }&token=${data?.user.name ?? ""}`;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeToRedirect(timeToRedirect - 1);
      if (timeToRedirect === 0) {
        window.open(url, "_blank");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timeToRedirect]);

  return (
    <div>
      {status !== "loading" && (
        <div>
          <Link href={url}>
            <div className="d-flex flex-items-center flex-justify-center flex-column">
              <div
                className="Box d-flex flex-items-center flex-justify-center flex-column p-4 p-4 m-2"
                style={{ maxWidth: "80ch" }}
              >
                <h1 className="h3 mb-3 f4 text-normal"> Open VSCodium</h1>
                {timeToRedirect > 0 ? (
                  <p>We will try opening it in {timeToRedirect}...</p>
                ) : null}
              </div>
            </div>
          </Link>
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            }}
          >
            {userEmail && (
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                  }}
                >
                  <div className="p-3">
                    {githubUserData?.name || githubUserData?.email ? (
                      <InfoPanel
                        info={{
                          organization: githubUserData?.company,
                          user_avatar_url: githubUserData?.avatar_url,
                          user_displayname: githubUserData?.name,
                          user_email: githubUserData?.email,
                          service_name: "GitHub",
                        }}
                      />
                    ) : (
                      <GitHubLoginLink userEmail={userEmail} />
                    )}
                  </div>

                  <div className="p-3">
                    {bitbucketUserData?.name || bitbucketUserData?.email ? (
                      <InfoPanel
                        info={{
                          organization: bitbucketUserData?.organization,
                          user_avatar_url: bitbucketUserData?.avatar_url,
                          user_displayname: bitbucketUserData?.name,
                          user_email: bitbucketUserData?.email,
                          service_name: "Bitbucket",
                        }}
                      />
                    ) : (
                      <BitbucketLoginLink userEmail={userEmail} />
                    )}
                  </div>

                  <div className="p-3">
                    {gitlabUserData?.name || gitlabUserData?.email ? (
                      <InfoPanel
                        info={{
                          organization: gitlabUserData?.organization,
                          user_avatar_url: gitlabUserData?.avatar_url,
                          user_displayname: gitlabUserData?.name,
                          user_email: gitlabUserData?.email,
                          service_name: "GitLab",
                        }}
                      />
                    ) : (
                      <GitLabLoginLink userEmail={userEmail} />
                    )}
                  </div>
                  <div className="p-3">
                    {jiraUserData?.organization ? (
                      <InfoPanel
                        info={{
                          organization: jiraUserData?.organization,
                          user_avatar_url: jiraUserData?.user_avatar_url,
                          user_displayname: jiraUserData?.user_displayname,
                          user_email: jiraUserData?.user_email,
                          service_name: "Jira",
                        }}
                      />
                    ) : (
                      <JiraLoginLink userEmail={userEmail} hasPaid={hasPaid} />
                    )}
                  </div>
                  <div className="p-3">
                    {slackUserData?.user_username ||
                    slackUserData?.user_email ? (
                      <InfoPanel
                        info={{
                          organization: slackUserData?.team_name,
                          user_avatar_url: slackUserData?.user_picture_url,
                          user_displayname: slackUserData?.user_real_name,
                          user_email: slackUserData?.user_email,
                          service_name: "Slack",
                        }}
                      />
                    ) : (
                      <SlackLoginLink userEmail={userEmail} hasPaid={hasPaid} />
                    )}
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                  }}
                ></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VSCodium;
