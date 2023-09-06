import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import TimeToRedirect from "../../../components/redirect";
import getAllPublicUserData from "../../../utils/api/getAllUserPublicData";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "IntelliJ Login",
  description: "Login to Watermelon Context on IntelliJ",
};
async function IntelliJ() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const userName = session?.user?.name;
  const data = await getAllPublicUserData({ userEmail });

  return (
    <div>
      <>
        <span className="text-2xl font-bold">IntelliJ Login</span>
        <p>Use this email to login in IntelliJ</p>
        <p>{userEmail}</p>
        <TimeToRedirect url={"/"} />
      </>
    </div>
  );
}

export default IntelliJ;
