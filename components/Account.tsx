import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [DBJiraOrg, setDBJiraOrg] = useState(null);

  const [userId, setUserId] = useState(null);
  useEffect(() => {
    setUserId(supabase.auth.user().id);
    getJiraOrg();
  }, []);

  async function getJiraOrg() {
    try {
      fetch("/api/jira/getOrganization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: supabase.auth.user().id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setDBJiraOrg(null);
          } else {
            setDBJiraOrg(data.organization);
          }
        });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="form-widget">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor="username">Name</label>
        <input
          id="username"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="website"
          value={website || ""}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
        {DBJiraOrg ? (
          <p>logged in to {DBJiraOrg} with Jira</p>
        ) : (
          <Link
            href={`https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=VUngRAClu8ZE56vxXCFBocTxCTLEUQTT&scope=read:jira-user%20read:jira-work%20write:jira-work%20offline_access&redirect_uri=https://app.watermelontools.com/jira&state=${userId}&response_type=code&prompt=consent`}
          >
            <a className="button block">Login to Jira</a>
          </Link>
        )}
      </div>

      <p>{userId}</p>
      <div>
        <button
          style={{ marginTop: "20px" }}
          className="button block"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
