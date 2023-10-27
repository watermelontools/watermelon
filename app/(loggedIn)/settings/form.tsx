"use client";

import { useEffect, useState } from "react";
import getUserSettings from "../../../utils/api/getUserSettings";

export default function form({ userEmail }) {
  const [saveDisabled, setSaveDisabled] = useState(false);

  const setUserSettingsState = async (userEmail) => {
    let settings = await getUserSettings(userEmail);
    setFormState(settings);
  };
  const services = [
    {
      valueLabel: "JiraTickets",
      label: "Jira Tickets",
    },
    {
      valueLabel: "SlackMessages",
      label: "Slack Messages",
    },
    {
      valueLabel: "GitHubPRs",
      label: "GitHub PRs",
    },
    {
      valueLabel: "NotionPages",
      label: "Notion Pages",
    },
    {
      valueLabel: "LinearTickets",
      label: "Linear Tickets",
    },
    {
      valueLabel: "ConfluenceDocs",
      label: "Confluence Docs",
    },
    {
      valueLabel: "AsanaTasks",
      label: "Asana Tasks",
    },
  ];
  let defaultState = {
    AISummary: 1,
  };
  services.map((service) => (defaultState[service.valueLabel] = 3));
  const [formState, setFormState] = useState(defaultState);
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
      <div style={{ display: "flex", alignItems: "center" }}>
        {" "}
        <span style={{ width: "100px" }}>{label}</span>{" "}
        <select
          className="form-select mt-2"
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
          {" "}
          {Array.from({ length: 5 }, (_, index) => (
            <option key={index} value={index + 1}>
              {" "}
              {index + 1}{" "}
            </option>
          ))}{" "}
        </select>{" "}
      </div>
    );
  }
  return (
    <form>
      {services.map((service) => (
        <SettingsSelector
          key={service.valueLabel}
          valueLabel={service.valueLabel}
          label={service.label}
        />
      ))}
      <div style={{ display: "flex", alignItems: "center" }}>
        <span>AI Summary: </span>
        <select
          className="form-select ml-3 mt-2"
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
