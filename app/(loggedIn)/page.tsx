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
  const comingSoon = [
    "IntelliJ",
    "Android Studio",
    "AppCode",
    "Aqua",
    "CLion",
    "DataGrip",
    "DataSpell",
    "GoLand",
    "MPS",
    "PhpStorm",
    "PyCharm",
    "Rider",
    "RubyMine",
    "RustRover",
    "WebStorm",
  ];
  return (
    <div>
      {data && <LoginGrid userEmail={userEmail} data={data} />}
      {userEmail && (
        <div style={{ height: "100%" }}>
          <div
            className="Subhead px-3"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 2,
              backgroundColor: "var(--color-canvas-default)",
            }}
          >
            <h2 className="Subhead-heading d-flex flex-items-center flex-justify-start">
              <span>IDEs</span>
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            }}
          >
            <div className="pl-3 pr-3 pt-1 pb-3" style={{ flex: 1 }}>
              <DownloadExtension
                name="VSCode"
                email={userEmail}
                urlStart="vscode"
                accessToken={userName}
              />
            </div>

            <div className="pl-3 pr-3 pt-1 pb-3" style={{ flex: 1 }}>
              <DownloadExtension
                name="VSCode Insiders"
                urlStart="vscode-insiders"
                email={userEmail}
                accessToken={userName}
              />
            </div>
            <div className="pl-3 pr-3 pt-1 pb-3" style={{ flex: 1 }}>
              <DownloadExtension
                name="VSCodium"
                urlStart="vscodium"
                email={userEmail}
                accessToken={userName}
              />
            </div>
            {comingSoon.map((name) => (
              <a href="https://plugins.jetbrains.com/plugin/22720-watermelon-context">
                <div className="p-3">
                  <div className="Box d-flex flex-items-center flex-justify-start p-2">
                    <img
                      className="avatar avatar-8"
                      src={`/logos/${name.toLowerCase()}.svg`}
                    />
                    <div className="p-2">
                      <h2>{name}</h2>
                      <p>Download now</p>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
