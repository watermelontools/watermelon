import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@primer/react";
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider colorMode="night">
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}
