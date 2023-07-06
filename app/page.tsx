import LoginGrid from "../components/loginGrid";
import DownloadExtension from "../components/dashboard/DownloadExtension";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import getAllPublicUserData from "../utils/api/getAllUserPublicData";

async function HomePage({}) {
  const session = await getServerSession(authOptions);
  let userEmail = session?.user?.email;
  let userName = session?.user?.name;
  // if not logged in, do not show anything
  const data = await getAllPublicUserData({ userEmail });
  return (
    <div>
      <>
        <>
          <LoginGrid userEmail={userEmail} data={data} />
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
          <a href="https://github.com/apps/watermelon-context" target="_blank">
            <div className="Box d-flex flex-items-center flex-justify-start m-3 p-2">
              <img className="avatar avatar-8" src="/logos/github.svg" />
              <div className="p-2">
                <h2>Try our GitHub App</h2>
                <p>Context on each Pr</p>
              </div>
            </div>
          </a>
        </>
      </>
    </div>
  );
}

export default HomePage;
