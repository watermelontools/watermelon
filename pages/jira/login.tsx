import Link from "next/link";
import { supabase } from "../../utils/supabase";

export default function LoginPage() {
  return (
    <Link
      href={`https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=VUngRAClu8ZE56vxXCFBocTxCTLEUQTT&scope=read:jira-user%20read:jira-work%20write:jira-work%20offline_access&redirect_uri=https://app.watermelon.tools&state=${
        supabase.auth.user().id
      }&response_type=code&prompt=consent`}
    >
      Login
    </Link>
  );
}
