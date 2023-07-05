import "@primer/css/index.scss";

import AuthProvider from "../lib/auth/AuthProvider";
import Navbar from "../components/Navbar";
import { getServerSession } from "next-auth";
import Header from "../components/Header";
import { authOptions } from "./api/auth/[...nextauth]/route";
import LogInBtn from "../components/login-btn";
export const metadata = {
  title: "Watermelon",
  description: "Get context on each PR",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  let userEmail = session?.user?.email;
  let userName = session?.user?.name;
  if (!session) return <LogInBtn />;

  return (
    <html lang="en" data-color-mode="dark" data-dark-theme="dark">
      <body>
        <AuthProvider>
          <Header userEmail={userEmail} userToken={userName} />
          <Navbar>{children}</Navbar>
        </AuthProvider>
      </body>
    </html>
  );
}
