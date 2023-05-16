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
            <div className="p-3">
              <h2>Settings</h2>
              <div className="">
                <div className="Subhead">
                  <span className="Subhead-heading">Action Settings</span>
                  <div className="Subhead-description">
                    This controls how the action behaves.
                  </div>
                </div>
                //form goes here
                <form>
                  <div className="">
                    <span>Jira Tickets: </span>
                    <select
                      className="form-select"
                      aria-label="Amount of Jira Tickets"
                      defaultValue={userSettings?.JiraTickets}
                    >
                      {Array.from(Array(11)).map((i, index) => {
                        if (index === 0) {
                          return null;
                        }
                        return <option value={index}>{index}</option>;
                      })}
                    </select>
                  </div>
                  <div className="">
                    <span>Slack Messages: </span>
                    <select
                      className="form-select"
                      aria-label="Amount of Slack Messages"
                      defaultValue={userSettings?.SlackMessages}
                    >
                      {Array.from(Array(11)).map((i, index) => {
                        if (index === 0) {
                          return null;
                        }
                        return <option value={index}>{index}</option>;
                      })}
                    </select>
                  </div>
                  <div className="">
                    <span>GitHub PRs: </span>
                    <select
                      className="form-select"
                      aria-label="Amount of GitHub PRs"
                      defaultValue={userSettings?.GitHubPRs}
                    >
                      {Array.from(Array(11)).map((i, index) => {
                        if (index === 0) {
                          return null;
                        }
                        return <option value={index}>{index}</option>;
                      })}
                    </select>
                  </div>
                  <div className="">
                    <span>AI Summary: </span>
                    <select
                      className="form-select"
                      aria-label="AI Summary"
                      defaultValue={userSettings?.AISummary}
                    >
                      <option value={1}>Active</option>;
                      <option value={0}>Inactive</option>;
                    </select>
                  </div>
                  <button className="btn btn-primary" type="button">
                    Save
                  </button>
                </form>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export default HomePage;
