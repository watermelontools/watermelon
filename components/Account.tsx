import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import Avatar from "./Avatar";

export default function Account({ session, jiraOrg }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [DBJiraOrg, setDBJiraOrg] = useState(null);
  useEffect(() => {
    getProfile();
    if (!jiraOrg) getJiraOrg();
  }, [session]);
  const [userId, setUserId] = useState(null);
  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }
      console.log(user.id);
      if (data) {
        setUserId(user.id);
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }
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
            setDBJiraOrg(data);
          }
        });
    } catch (error) {
      console.error(error);
    }
  }
  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
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
      <Avatar
        url={avatar_url}
        size={150}
        onUpload={(url) => {
          setAvatarUrl(url);
          updateProfile({ username, website, avatar_url: url });
        }}
      />
      <div>
        <button
          className="button block primary"
          onClick={() => updateProfile({ username, website, avatar_url })}
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>
      <div>
        {jiraOrg ? (
          <p>logged in to {jiraOrg} with Jira</p>
        ) : DBJiraOrg ? (
          <p>logged in to {DBJiraOrg} with Jira</p>
        ) : (
          <Link
            href={`https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=VUngRAClu8ZE56vxXCFBocTxCTLEUQTT&scope=read:jira-user%20read:jira-work%20write:jira-work%20offline_access&redirect_uri=https://app.watermelon.tools&state=${
              userId ? userId : ""
            }&response_type=code&prompt=consent`}
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
