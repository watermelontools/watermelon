import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import "@primer/css/index.scss";
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <Analytics />
    </SessionProvider>
  );
}
