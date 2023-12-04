import LoginGrid from "../../components/loginGrid";
import DownloadExtension from "../../components/dashboard/DownloadExtension";

async function loading({}) {
  const userEmail = "tulia@watermelontools.com";
  const userName = "Tulia";
  const fakeObject = JSON.stringify({
    organization: "watermelon",
    user_avatar_url: "/logos/watermelon.svg",
    user_displayname: "Watermelon",
    user_email: "tulia@watermelontools.com",
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            }}
          >
            <div className="p-3">
              <DownloadExtension
                name="VSCode"
                email={userEmail}
                urlStart="vscode"
                accessToken={userName}
              />
            </div>
            <div className="p-3">
              <DownloadExtension
                name="VSCode Insiders"
                urlStart="vscode-insiders"
                email={userEmail}
                accessToken={userName}
              />
            </div>
            <div className="p-3">
              <DownloadExtension
                name="VSCodium"
                urlStart="vscodium"
                email={userEmail}
                accessToken={userName}
              />
            </div>
          </div>
        </>
      </>
    </div>
  );
}

export default loading;
