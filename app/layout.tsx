import "@primer/css/index.scss";

import AuthProvider from "../lib/auth/AuthProvider";

export const metadata = {
  title: "Watermelon",
  description: "Get context on each PR",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
