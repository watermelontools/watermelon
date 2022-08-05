import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export default function Test({}) {
  const [access_token, setAT] = useState(null);
  const [cloudId, setCI] = useState(null);
  const [project, setP] = useState(null);
  useEffect(() => {
    fetch("/api/jira/getToken", {
      method: "POST",
      body: JSON.stringify({
        user: supabase.auth.user().id,
      }),
    })
      .then((res) => res.json())
      .then((resJson) => {
        setAT(resJson.access_token);
        setCI(resJson.cloudId);
      });
  }, []);
  useEffect(() => {
    fetch(`https://api.atlassian.com/ex/jira/${cloudId}/rest/api/2/project`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => res.json())
      .then((resJson) => {
        console.log(resJson);
      });
  }, [access_token]);
  return (
    <div>
      <p>{access_token}</p>
      <p>{cloudId}</p>
    </div>
  );
}
