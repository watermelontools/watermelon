import "@primer/css/index.scss";

import { getServerSession } from "next-auth";

import Navbar from "../components/Navbar";
import Header from "../components/Header";
import LogInBtn from "../components/login-btn";

import AuthProvider from "../lib/auth/AuthProvider";

import { authOptions } from "./api/auth/[...nextauth]/route";
import { ReactNode, Suspense } from "react";

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
  let userEmail = session?.user?.email;
  let userName = session?.user?.name;

  return (
    <html lang="en" data-color-mode="dark" data-dark-theme="dark">
      <body>
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
      </body>
    </html>
  );
}
