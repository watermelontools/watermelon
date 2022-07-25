import Link from "next/link";

export default function LoginPage() {
  return (
    <Link
      href={`https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=VUngRAClu8ZE56vxXCFBocTxCTLEUQTT&scope=read:jira-user%20read:jira-work%20write:jira-work&redirect_uri=https://app.watermelon.tools&state=something&response_type=code&prompt=consent`}
    >
      Login
    </Link>
  );
}
