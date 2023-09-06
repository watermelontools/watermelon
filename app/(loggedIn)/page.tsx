import LoginGrid from "../../components/loginGrid";
import DownloadExtension from "../../components/dashboard/DownloadExtension";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import getAllPublicUserData from "../../utils/api/getAllUserPublicData";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Context of your team",
};
async function HomePage({}) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const userName = session?.user?.name;
  // if not logged in, do not show anything
  const data = await getAllPublicUserData({ email: userEmail }).catch((e) => {
    console.error(e);
    return null;
  });
  console.log(data);
  const comingSoon = [
    "PHPStorm",
    "IntelliJ",
    "WebStorm",
    "PyCharm",
    "RubyMine",
  ];
  return (
    <div>
      {data && <LoginGrid userEmail={userEmail} data={data} />}
      {userEmail && (
        <div>
          <div
            className="Subhead p-3"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 2,
              backgroundColor: "var(--color-canvas-default)",
            }}
          >
            <h2 className="Subhead-heading">IDEs</h2>
          </div>
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
            {comingSoon.map((name) => (
              <div className="p-3">
                <div className="Box d-flex flex-items-center flex-justify-start p-2">
                  <img
                    className="avatar avatar-8"
                    src={`/logos/${name.toLowerCase()}.svg`}
                  />
                  <div className="p-2">
                    <h2>{name}</h2>
                    <p>Coming Soon</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
