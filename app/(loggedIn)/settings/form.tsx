"use client";

import { useEffect, useState } from "react";
import getUserSettings from "../../../utils/api/getUserSettings";

let defaultState = {
  AISummary: 1,
  CodeComments: 1,
  Badges: 1,
};
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

  return (
    <form onSubmit={handleSubmit}>
      <div>
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
      </div>
      <div>
        <div
          className="Subhead"
          title="This is a tooltip that if hovered will explain what it does"
        >
          <h3 className="Subhead-heading">Search results</h3>
        </div>
        <label htmlFor={`search-amount`} className="d-flex flex-items-center">
          Number of results per platform:
          <select
            className="form-select select-sm mt-2"
            defaultValue={3}
            id={`search-amount`}
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
        Response texts:
        <input
          className="form-checkbox  "
          type="checkbox"
          id={`texts-nuclear`}
          name={`texts-nuclear`}
          checked
        />
      </div>

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
