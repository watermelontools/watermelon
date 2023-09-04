import "@primer/css/index.scss";

import { getServerSession } from "next-auth";

import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import LogInBtn from "../../components/login-btn";

import { authOptions } from ".././api/auth/[...nextauth]/route";
import { ReactNode } from "react";
import AuthProvider from "../../lib/auth/AuthProvider";

export const metadata = {
  title: {
    template: "%s | Watermelon",
    default: "Watermelon",
  },
  description: "Get context on each PR",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const userName = session?.user?.name;

  return (
    <>
      {userEmail ? (
        <>
          <Header userEmail={userEmail} userToken={userName} />
          <Navbar>
            <AuthProvider>{children}</AuthProvider>
          </Navbar>
        </>
      ) : (
        <LogInBtn />
      )}
    </>
  );
}
