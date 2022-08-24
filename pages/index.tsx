import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import LogInBtn from "../components/login-btn";

function HomePage({ organization }) {
  const [userEmail, setUserEmail] = useState(null);

  const { data: session } = useSession();
  useEffect(() => {
    setUserEmail(session?.user?.email);
  }, []);
  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      <LogInBtn />

      <Link
        href={`https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=VUngRAClu8ZE56vxXCFBocTxCTLEUQTT&scope=read:jira-user%20read:jira-work%20write:jira-work%20offline_access&redirect_uri=https://app.watermelontools.com/jira&state=${userEmail}&response_type=code&prompt=consent`}
      >
        <a className="button block">Login to Jira</a>
      </Link>
    </div>
  );
}

export default HomePage;
