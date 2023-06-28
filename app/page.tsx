import Header from "../components/Header";
import LogInBtn from "../components/login-btn";
import LoginGrid from "../components/loginGrid";
import DownloadExtension from "../components/dashboard/DownloadExtension";
import { getServerSession } from "next-auth";
import authOptions from "./auth/[...nextauth]/route";
async function HomePage({}) {
  const session = await getServerSession(authOptions);
  console.log(session);
  // @ts-ignore
  let userEmail = session?.user?.email;
  // @ts-ignore
  let userName = session?.user?.name;

  return (
    <div>
      {!session && <LogInBtn />}
      {session && <Header />}
      {session && (
        <>
          {session ? <Header /> : <LogInBtn />}
          {userEmail ? (
            <>
              <LoginGrid userEmail={userEmail} />
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
              <a
                href="https://github.com/apps/watermelon-context"
                target="_blank"
              >
                <div className="Box d-flex flex-items-center flex-justify-start p-2">
                  <div className="p-2">
                    <h2>Try our GitHub App</h2>
                    <p>Context on each Pr</p>
                  </div>
                </div>
              </a>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}

export default HomePage;
