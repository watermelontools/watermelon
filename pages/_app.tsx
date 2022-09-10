import { SessionProvider } from "next-auth/react";
import { ThemeProvider, BaseStyles } from "@primer/components";
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <ThemeProvider colorMode="night" dayScheme="dark" nightScheme="dark">
      <BaseStyles>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </BaseStyles>
    </ThemeProvider>
  );
}
