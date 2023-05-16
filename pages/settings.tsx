import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import Header from "../components/Header";
import LogInBtn from "../components/login-btn";

import getUserSettings from "../utils/api/getUserSettings";

function HomePage({}) {
  const [userEmail, setUserEmail] = useState(null);
  const [userSettings, setUserSettings] = useState(null);
  const [saveDisabled, setSaveDisabled] = useState(false);
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
  const [formState, setFormState] = useState({
    JiraTickets: userSettings?.JiraTickets || 3,
    SlackMessages: userSettings?.SlackMessages || 3,
    GitHubPRs: userSettings?.GitHubPRs || 3,
    AISummary: userSettings?.AISummary || 3,
  });

  const handleSubmit = async () => {
    setSaveDisabled(true);
    try {
      const response = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        console.log("Form saved successfully");
        console.log(response);
      } else {
        console.error("Failed to save the form");
      }
    } catch (error) {
      console.error("An error occurred while saving the form", error);
    } finally {
      setSaveDisabled(false);
    }
  };

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
                <form>
                  <div className="">
                    <span>Jira Tickets: </span>
                    <select
                      className="form-select"
                      aria-label="Amount of Jira Tickets"
                      defaultValue={userSettings?.JiraTickets}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          JiraTickets: e.target.value,
                        })
                      }
                      value={formState.JiraTickets}
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
                      value={formState.SlackMessages}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          SlackMessages: e.target.value,
                        })
                      }
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
                      value={formState.GitHubPRs}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          GitHubPRs: e.target.value,
                        })
                      }
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
                      value={formState.AISummary}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          AISummary: e.target.value,
                        })
                      }
                    >
                      <option value={1}>Active</option>;
                      <option value={0}>Inactive</option>;
                    </select>
                  </div>
                  <button
                    className="btn btn-primary"
                    type="button"
                    disabled={saveDisabled}
                    onClick={handleSubmit}
                  >
                    {saveDisabled ? "Saving..." : "Save"}
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
