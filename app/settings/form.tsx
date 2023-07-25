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
        body: JSON.stringify({ userSettings: formState, user: userEmail }),
      }).then((res) => res.json());
      if (
        response.AISummary === formState.AISummary ||
        response.JiraTickets === formState.JiraTickets ||
        response.SlackMessages === formState.SlackMessages ||
        response.GitHubPRs === formState.GitHubPRs ||
        response.NotionPages === formState.NotionPages ||
        response.LinearTickets === formState.LinearTickets
      ) {
        setUserSettingsState(userEmail);
      } else {
        console.error("Failed to save the form");
      }
    } catch (error) {
      console.error("An error occurred while saving the form", error);
    } finally {
      setSaveDisabled(false);
    }
  };
  useEffect(() => {
    setUserSettingsState(userEmail);
  }, [userEmail]);

  function SettingsSelector({ label, value, onChange, defaultValue }) {
    return (
      <div className="">
        <span>{label} </span>
        <select
          className="form-select"
          aria-label={label}
          defaultValue={defaultValue}
          onChange={onChange}
          value={value}
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
      <SettingsSelector
        label="Jira Tickets"
        value={formState.JiraTickets}
        onChange={(e) =>
          setFormState({
            ...formState,
            JiraTickets: parseInt(e.target.value),
          })
        }
        defaultValue={formState?.JiraTickets}
      />
      <SettingsSelector
        label="Slack Messages"
        value={formState.SlackMessages}
        onChange={(e) =>
          setFormState({
            ...formState,
            SlackMessages: parseInt(e.target.value),
          })
        }
        defaultValue={formState?.SlackMessages}
      />
      <SettingsSelector
        label="GitHub PRs"
        value={formState.GitHubPRs}
        onChange={(e) =>
          setFormState({
            ...formState,
            GitHubPRs: parseInt(e.target.value),
          })
        }
        defaultValue={formState?.GitHubPRs}
      />
      <SettingsSelector
        label="Notion Pages"
        value={formState.NotionPages}
        onChange={(e) =>
          setFormState({
            ...formState,
            NotionPages: parseInt(e.target.value),
          })
        }
        defaultValue={formState?.NotionPages}
      />
      <SettingsSelector
        label="Linear Tickets"
        value={formState.LinearTickets}
        onChange={(e) =>
          setFormState({
            ...formState,
            LinearTickets: parseInt(e.target.value),
          })
        }
        defaultValue={formState?.LinearTickets}
      />
      <SettingsSelector
        label="Confluence Docs"
        value={formState.ConfluenceDocs}
        onChange={(e) =>
          setFormState({
            ...formState,
            ConfluenceDocs: parseInt(e.target.value),
          })
        }
        defaultValue={formState?.ConfluenceDocs}
      />

      <div className="">
        <span>AI Summary: </span>
        <select
          className="form-select"
          aria-label="AI Summary"
          defaultValue={formState?.AISummary}
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
