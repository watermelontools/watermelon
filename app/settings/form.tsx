"use client";

import { useEffect, useState } from "react";
import getUserSettings from "../../utils/api/getUserSettings";

export default function form({ userEmail }) {
  const [saveDisabled, setSaveDisabled] = useState(false);

  const setUserSettingsState = async (userEmail) => {
    let settings = await getUserSettings(userEmail);
    setFormState(settings);
  };
  const [formState, setFormState] = useState({
    JiraTickets: 3,
    SlackMessages: 3,
    GitHubPRs: 3,
    NotionPages: 3,
    LinearTickets: 3,
    ConfluenceDocs: 3,
    AISummary: 1,
  });
  const handleSubmit = async () => {
    setSaveDisabled(true);
    try {
      const response = await fetch("/api/user/updateSettings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userSettings: formState, email: userEmail }),
      }).then((res) => setUserSettingsState(userEmail));
    } catch (error) {
      console.error("An error occurred while saving the form", error);
    } finally {
      setSaveDisabled(false);
    }
  };
  useEffect(() => {
    setUserSettingsState(userEmail);
  }, [userEmail]);

  function SettingsSelector({ label, valueLabel }) {
    return (
      <div className="">
        <span>{label}</span>
        <select
          className="form-select"
          aria-label={label}
          defaultValue={formState[valueLabel]}
          onChange={(e) =>
            setFormState({
              ...formState,
              [valueLabel]: parseInt(e.target.value),
            })
          }
          value={formState[valueLabel]}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <option key={index} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
      </div>
    );
  }
  return (
    <form>
      <SettingsSelector label="Jira Tickets" valueLabel={"JiraTickets"} />
      <SettingsSelector label="Slack Messages" valueLabel={"SlackMessages"} />
      <SettingsSelector label="GitHub PRs" valueLabel={"GitHubPRs"} />
      <SettingsSelector label="Notion Pages" valueLabel={"NotionPages"} />
      <SettingsSelector label="Linear Tickets" valueLabel={"LinearTickets"} />
      <SettingsSelector label="Confluence Docs" valueLabel={"ConfluenceDocs"} />

      <div className="">
        <span>AI Summary: </span>
        <select
          className="form-select"
          aria-label="AI Summary"
          value={formState.AISummary}
          onChange={(e) =>
            setFormState({
              ...formState,
              AISummary: parseInt(e.target.value),
            })
          }
        >
          <option value={1}>Active</option>
          <option value={0}>Inactive</option>
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
  );
}
