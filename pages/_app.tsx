import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import "@primer/css/index.scss";
export default function App({ Component }) {
  return <Component />;
}
