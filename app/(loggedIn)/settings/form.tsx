"use client";

import { useEffect, useState } from "react";
import getUserSettings from "../../../utils/api/getUserSettings";

export default function form({ userEmail }) {
  const [saveDisabled, setSaveDisabled] = useState(false);

  const setUserSettingsState = async (userEmail) => {
    let settings = await getUserSettings(userEmail);
    const parsedAdditionalSettings = JSON.parse(settings.AdditionalSettings);
    let setSettings = parsedAdditionalSettings
      ? { ...settings, ...parsedAdditionalSettings }
      : settings;
    setFormState(setSettings);
  };
  const services = [
    {
      valueLabel: "GitHubPRs",
      label: "GitHub PRs",
    },
    {
      valueLabel: "JiraTickets",
      label: "Jira Tickets",
    },
    {
      valueLabel: "SlackMessages",
      label: "Slack Messages",
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
    CodeComments: 1,
    Badges: 1,
  };
  services.forEach(
    (service) =>
      (defaultState[service.valueLabel] = {
        Amount: 3,
        NoLoginText: "Click here to login to {{systemName}}",
        NoResultsText: "No results found in {{systemName}}",
        ErrorFetchingText: "Could not fetch {{systemName}}",
      })
  );

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

  function ServiceSettingsArea({ label, valueLabel }) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="Subhead"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            backgroundColor: "var(--color-canvas-default)",
          }}
        >
          <h3 className="Subhead-heading">{label}</h3>
        </div>
        <div>
          <div className="form-group-header">
            <h4>Search Params:</h4>
          </div>
          <label
            htmlFor={`${valueLabel}-amount`}
            className="d-flex flex-items-center"
          >
            Amount:
            <select
              className="form-select select-sm mt-2"
              aria-label={label}
              defaultValue={formState[valueLabel].Amount}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  [valueLabel]: parseInt(e.target.value),
                })
              }
              value={formState[valueLabel].Amount}
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
          </label>
        </div>
        <div>
          <div className="form-group-header">
            <h4>Response Texts:</h4>
            <p>
              Use{" "}
              <code className="text-gray-100 bg-gray-300">{`{{systemName}}`}</code>{" "}
              to replace with "{label}"
            </p>
          </div>
          <div className="form-group-body">
            <div>
              <label htmlFor={`${valueLabel}-no-login`}>No login:</label>
              <input
                style={{ width: "100%" }}
                className="form-control"
                type="text"
                value={formState[valueLabel].NoLoginText}
                id={`${valueLabel}-no-login`}
              />
            </div>
            <div>
              <label htmlFor={`${valueLabel}-error-fetching`}>
                Error fetching:
              </label>
              <input
                style={{ width: "100%" }}
                className="form-control"
                type="text"
                value={formState[valueLabel].ErrorFetchingText}
                id={`${valueLabel}-error-fetching`}
              />
            </div>
            <div>
              <label htmlFor={`${valueLabel}-no-results`}>
                No results found:
              </label>
              <input
                style={{ width: "100%" }}
                className="form-control"
                type="text"
                value={formState[valueLabel].NoResultsText}
                id={`${valueLabel}-no-results`}
              />
            </div>
            <div>
              <label htmlFor={`${valueLabel}-nuclear`}>
                Deactivate completely:
                <input
                  className="form-checkbox  "
                  type="checkbox"
                  value="Example Value"
                  id={`${valueLabel}-nuclear`}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <form>
      {services.map((service) => (
        <ServiceSettingsArea
          key={service.valueLabel}
          valueLabel={service.valueLabel}
          label={service.label}
        />
      ))}
      <div className="Subhead">
        <h3 className="Subhead-heading">Watermelon AI</h3>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className="form-group-header">
          <h4>PR Comment</h4>
        </div>
      </div>
      <div>
        <label htmlFor={`AI-summary`} className="d-flex flex-items-center">
          Deactivate Summary:
          <select
            className="form-select ml-3 mt-2"
            aria-label="AI Summary"
            value={formState.AISummary}
            id={`AI-summary`}
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
        </label>
      </div>
      <div>
        <label htmlFor={`AI-Badges`} className="d-flex flex-items-center">
          Deactivate Badges:
          <select
            className="form-select ml-3 mt-2"
            aria-label="AI Badges"
            value={formState.AISummary}
            id={`AI-Badges`}
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
        </label>
      </div>
      <div>
        <label
          htmlFor={`AI-code-comments`}
          className="d-flex flex-items-center"
        >
          Deactivate Code Comments:
          <select
            className="form-select ml-3 mt-2"
            aria-label="AI Summary"
            value={formState.AISummary}
            id={`AI-code-comments`}
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
        </label>
      </div>
      <div
        className="d-flex flex-row-reverse"
        style={{ bottom: "1rem", right: "1rem", position: "sticky", zIndex: 3 }}
      >
        <button
          className="btn btn-primary"
          type="button"
          disabled={saveDisabled}
          onClick={handleSubmit}
        >
          {saveDisabled ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
