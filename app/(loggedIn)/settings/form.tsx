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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="Subhead">
          <h3 className="Subhead-heading">{label}</h3>
        </div>
        <div>
          <div className="form-group-header">
            <h4>Search Params:</h4>
          </div>
          <label htmlFor={`${valueLabel}-amount`}>Amount:</label>
          <div className="form-group-body">
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
              id={`${valueLabel}-amount`}
              style={{ width: "15ch" }}
            >
              {" "}
              {Array.from({ length: 5 }, (_, index) => (
                <option key={index} value={index + 1}>
                  {" "}
                  {index + 1}{" "}
                </option>
              ))}{" "}
            </select>
          </div>
        </div>
        <div>
          <div className="form-group-header">
            <h4>Response Texts:</h4>
            <p>
              Use{" "}
              <code className="text-gray-100 bg-gray-300">{`{{systemName}}`}</code>{" "}
              to replace with "{label}""
            </p>
          </div>
          <div className="form-group-body">
            <div>
              <label htmlFor={`${valueLabel}-no-results`}>
                No results found:
              </label>
              <input
                className="form-control"
                type="text"
                value="Example Value"
                id={`${valueLabel}-no-results`}
              />
            </div>
            <div>
              <label htmlFor={`${valueLabel}-no-login`}>No login:</label>
              <input
                className="form-control"
                type="text"
                value="Example Value"
                id={`${valueLabel}-no-login`}
              />
            </div>
            <div>
              <label htmlFor={`${valueLabel}-error-fetching`}>
                Error fetching:
              </label>
              <input
                className="form-control"
                type="text"
                value="Example Value"
                id={`${valueLabel}-error-fetching`}
              />
            </div>
            <div>
              <label htmlFor={`${valueLabel}-nuclear`}>
                Deactivate completely:
              </label>
              <input
                className="form-control"
                type="checkbox"
                value="Example Value"
                id={`${valueLabel}-nuclear`}
              />
            </div>
          </div>
        </div>
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
