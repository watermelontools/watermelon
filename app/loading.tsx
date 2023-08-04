import LoginGrid from "../components/loginGrid";
import DownloadExtension from "../components/dashboard/DownloadExtension";

async function loading({}) {
  const userEmail = "tulia@watermelontools.com";
  const userName = "Tulia";
  const fakeObject = JSON.stringify({
    organization: "watermelon",
    user_displayname: userName,
    user_email: userEmail,
    user_avatar_url: "/logos/watermelon.svg",
  });
  const fakeData = {
    github_data: fakeObject,
    bitbucket_data: fakeObject,
    gitlab_data: fakeObject,
    slack_data: fakeObject,
    jira_data: fakeObject,
    linear_data: fakeObject,
    notion_data: fakeObject,
  };

  return (
    <div>
      <>
        <>
          <LoginGrid userEmail={userEmail} data={fakeData} />
          <a href="https://github.com/apps/watermelon-context" target="_blank">
            <div className="Box d-flex flex-items-center flex-justify-start m-3 p-2">
              <img className="avatar avatar-8" src="/logos/watermelon.svg" />
              <div className="p-2">
                <h2>Try our GitHub App</h2>
                <p>Context on each Pr</p>
              </div>
            </div>
          </a>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            }}
          >
            {[
              { name: "VSCode", urlStart: "vscode" },
              { name: "VSCode Insiders", urlStart: "vscode-insiders" },
              { name: "VSCodium", urlStart: "vscodium" },
            ].map(({ name, urlStart }) => (
              <div className="p-3">
                <DownloadExtension
                  name={name}
                  urlStart={urlStart}
                  email={userEmail}
                  accessToken={userName}
                />
              </div>
            ))}
          </div>
        </>
      </>
    </div>
  );
}

export default loading;
