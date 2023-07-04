import Navbar from "../../components/Navbar";
import { getServerSession } from "next-auth";
import Header from "../../components/Header";
import { authOptions } from "../api/auth/[...nextauth]/route";
import LogInBtn from "../../components/login-btn";
export default async function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  let userEmail = session?.user?.email;
  let userName = session?.user?.name;
  // if not logged in, do not show anything
  if (!session) return <LogInBtn />;
  return (
    <section>
      <Header userEmail={userEmail} userToken={userName} />
      <Navbar>{children}</Navbar>
    </section>
  );
}
