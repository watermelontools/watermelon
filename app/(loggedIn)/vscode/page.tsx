import Link from "next/link";
import LoginGrid from "../../../components/loginGrid";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import TimeToRedirect from "../../../components/redirect";
import getAllPublicUserData from "../../utils/api/getAllUserPublicData";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "VSCode Login",
  description: "Login to Watermelon Context on VSCode",
};
async function VSCode() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const userName = session?.user?.name;
  const data = await getAllPublicUserData({ userEmail });
  let system = "vscode";
  let url: string = `${system}://watermelontools.watermelon-tools?email=${
    userEmail ?? ""
  }&token=${userName ?? ""}`;

  return (
    <div>
      <>
        <Link href={url}>
          <div className="d-flex flex-items-center flex-justify-center flex-column">
            <div
              className="Box d-flex flex-items-center flex-justify-center flex-column p-4 p-4 m-2"
              style={{ maxWidth: "80ch" }}
            >
              <h1 className="h3 mb-3 f4 text-normal">Open VSCode</h1>
              <img className="avatar avatar-8" src={`/logos/vscode.svg`} />
              <TimeToRedirect url={url} />
            </div>
          </div>
        </Link>
        <LoginGrid userEmail={userEmail} data={data} />
      </>
    </div>
  );
}

export default VSCode;
