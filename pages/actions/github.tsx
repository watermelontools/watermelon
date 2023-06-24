import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import Header from "../../components/Header";
import LogInBtn from "../../components/login-btn";
import LoginGrid from "../../components/loginGrid";
import DownloadExtension from "../../components/dashboard/DownloadExtension";

function HomePage({}) {
  const [userEmail, setUserEmail] = useState<string | undefined | null>(null);

  const { data: session, status } = useSession();
  useEffect(() => {
    setUserEmail(session?.user?.email);
  }, [session]);

  return (
    <div>
      {status === "loading" && <Header />}
      {status === "unauthenticated" && <LogInBtn />}
      {status === "authenticated" && (
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
                    accessToken={session.user.name}
                  />
                </div>
                <div className="p-3">
                  <DownloadExtension
                    name="VSCode Insiders"
                    urlStart="vscode-insiders"
                    email={userEmail}
                    accessToken={session.user.name}
                  />
                </div>
                <div className="p-3">
                  <DownloadExtension
                    name="VSCodium"
                    urlStart="vscodium"
                    email={userEmail}
                    accessToken={session.user.name}
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
