import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import Header from "../components/Header";
import LogInBtn from "../components/login-btn";

import getUserSettings from "../utils/api/getUserSettings";

function HomePage({}) {
  const [userEmail, setUserEmail] = useState(null);
  const [userSettings, setUserSettings] = useState(null);
  const { data: session, status } = useSession();

  const setUserSettingsState = async (userEmail) => {
    let settings = await getUserSettings(userEmail);
    console.log(settings);
    setUserSettings(settings);
  };
  useEffect(() => {
    setUserEmail(session?.user?.email);
    setUserSettingsState(session?.user?.email);
  }, [session]);

  return (
    <div>
      {status === "loading" && <Header />}
      {status === "unauthenticated" && <LogInBtn />}
      {status === "authenticated" && (
        <>
          {session ? <Header /> : <LogInBtn />}
          {userEmail ? (
            <>
              <h2>Settings</h2>
              <div className="p-3">
                Action Settings
                <div className="p-3">
                  <span>Jira Tickets: {userSettings?.JiraTickets}</span>
                  <span>GitHub Issues: {userSettings?.githubIssues}</span>
                  <span>Slack Messages: {userSettings?.SlackMessages}</span>
                </div>
              </div>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}

export default HomePage;
