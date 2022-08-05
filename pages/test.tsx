import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export default function Test({}) {
  const [access_token, setAT] = useState(null);
  useEffect(() => {
    fetch("/api/jira/getToken", {
      method: "POST",
      body: JSON.stringify({
        user: supabase.auth.user().id,
      }),
    })
      .then((res) => res.json())
      .then((resJson) => setAT(resJson));
  }, []);
  return (
    <div>
      <p>{access_token}</p>
    </div>
  );
}
