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

  return (
    <div>
      {data && <LoginGrid userEmail={userEmail} data={data} />}
    </div>
  );
}

export default HomePage;
