"use client";

import { useEffect, useState } from "react";
import getUserSettings from "../../../utils/api/getUserSettings";
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

  const [formState, setFormState] = useState(defaultState);
  const setDefault = () => {
    setFormState(defaultState);
  };
  useEffect(() => {
    setUserSettingsState(userEmail);
  }, [userEmail]);
  const handleSubmit = async (e) => {
    setSaveDisabled(true);
    e.preventDefault(); // Prevent the browser from reloading the page
    // Read the form data
    const formData = new FormData(e.target);

    // You can pass formData as a fetch body directly if your server supports it:
    // However, if you want to send JSON, you can transform formData to JSON
    const formJson = Object.fromEntries(formData.entries());
    let transformed = {};
    Object.entries(formJson).forEach(([key, value]) => {
      const [service, setting] = key.split("-");
      if (!transformed[service]) {
        transformed[service] = {};
      }

      // Special case for non-object settings
      if (!setting) {
        transformed[service] = value;
        return;
      }

      // Convert keys like "GitHubPRs-noLogin" to { NoLoginText: "some value" }
      const formattedSetting = setting
        .replace(/noLogin/, "NoLoginText")
        .replace(/errorFetching/, "ErrorFetchingText")
        .replace(/noResults/, "NoResultsText")
        .replace(/AIsummary/, "AISummary")
        .replace(/Badges/, "Badges")
        .replace(/CodeComments/, "CodeComments");

      transformed[service][formattedSetting] = value;
    });
    try {
      const response = await fetch("/api/user/updateSettings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userSettings: {
            ...formState,
            AdditionalSettings: transformed,
          },
          email: userEmail,
        }),
      }).then((res) => setUserSettingsState(userEmail));
    } catch (error) {
      console.error("An error occurred while saving the form", error);
    } finally {
      setSaveDisabled(false);
    }
  };

  function ServiceSettingsArea({ label, valueLabel }) {
    const handleNoLoginChange = ({ service, value }) => {
      setFormState({
        ...formState,
        [service]: {
          ...formState[service],
          NoLoginText: value,
        },
      });
    };

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
              <label htmlFor={`${valueLabel}-noLogin`}>No login:</label>
              <input
                style={{ width: "100%" }}
                className="form-control"
                type="text"
                defaultValue={formState[valueLabel].NoLoginText}
                id={`${valueLabel}-noLogin`}
                name={`${valueLabel}-noLogin`}
              />
            </div>
            <div>
              <label htmlFor={`${valueLabel}-errorFetching`}>
                Error fetching:
              </label>
              <input
                style={{ width: "100%" }}
                className="form-control"
                type="text"
                defaultValue={formState[valueLabel].ErrorFetchingText}
                id={`${valueLabel}-errorFetching`}
                name={`${valueLabel}-errorFetching`}
              />
            </div>
            <div>
              <label htmlFor={`${valueLabel}-noResults`}>
                No results found:
              </label>
              <input
                style={{ width: "100%" }}
                className="form-control"
                type="text"
                defaultValue={formState[valueLabel].NoResultsText}
                id={`${valueLabel}-noResults`}
                name={`${valueLabel}-noResults`}
              />
            </div>
            <div>
              <label htmlFor={`${valueLabel}-nuclear`}>
                Deactivate completely:
                <input
                  className="form-checkbox  "
                  type="checkbox"
                  id={`${valueLabel}-nuclear`}
                  name={`${valueLabel}-nuclear`}
                  defaultValue={formState[valueLabel].Nuclear}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit}>
      <div
        className="Subhead"
        title="This is a tooltip that if hovered will explain what it does"
      >
        <h3 className="Subhead-heading">Watermelon AI</h3>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className="form-group-header">
          <h4>PR Comment</h4>
        </div>
      </div>
      <div>
        <label htmlFor={`AIsummary`} className="d-flex flex-items-center">
          Summary:
          <select
            className="form-select ml-3 mt-2"
            aria-label="AI Summary"
            defaultValue={formState.AISummary}
            id={`AIsummary`}
            name={`AIsummary`}
          >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
        </label>
      </div>
      <div>
        <label htmlFor={`Badges`} className="d-flex flex-items-center">
          Badges:
          <select
            className="form-select ml-3 mt-2"
            aria-label="AI Badges"
            defaultValue={formState.Badges}
            id={`Badges`}
            name={`Badges`}
          >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
        </label>
      </div>
      <div>
        <label htmlFor={`CodeComments`} className="d-flex flex-items-center">
          Code Comments:
          <select
            className="form-select ml-3 mt-2"
            aria-label="AI Summary"
            defaultValue={formState.CodeComments}
            id={`CodeComments`}
            name={`CodeComments`}
          >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
        </label>
      </div>
      {services.map((service) => (
        <ServiceSettingsArea
          key={service.valueLabel}
          valueLabel={service.valueLabel}
          label={service.label}
        />
      ))}
      <div
        className="d-flex flex-row-reverse"
        style={{ bottom: "1rem", right: "1rem", position: "sticky", zIndex: 3 }}
      >
        <button
          className="btn btn-primary"
          type="submit"
          disabled={saveDisabled}
        >
          {saveDisabled ? "Saving..." : "Save"}
        </button>
        <button type="button" className="btn mx-2" onClick={setDefault}>
          Reset to default
        </button>
      </div>
    </form>
  );
}
