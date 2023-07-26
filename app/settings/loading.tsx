import { getServerSession } from "next-auth";

import LogInBtn from "../../components/login-btn";

import { authOptions } from "../api/auth/[...nextauth]/route";

async function Settings({}) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  // if not logged in, do not show anything
  if (!session) return <LogInBtn />;

  function SettingsSelector({ label }) {
    return (
      <div className="">
        <span>{label}</span>
        <select
          className="form-select"
          aria-label={label}
          defaultValue={3}
          value={3}
        ></select>
      </div>
    );
  }
  return (
    <div>
      <div className="p-3">
        <h1>Settings</h1>
        <div className="">
          <div className="Subhead">
            <span className="Subhead-heading">App Settings</span>
            <div className="Subhead-description">
              This controls how the GitHub App behaves.
            </div>
          </div>
          <form>
            <SettingsSelector label="Jira Tickets" />
            <SettingsSelector label="Slack Messages" />
            <SettingsSelector label="GitHub PRs" />
            <SettingsSelector label="Notion Pages" />
            <SettingsSelector label="Linear Tickets" />
            <SettingsSelector label="Confluence Docs" />

            <div className="">
              <span>AI Summary: </span>
              <select className="form-select" aria-label="AI Summary" value={1}>
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
            <button className="btn btn-primary" type="button" disabled={true}>
              {"Save"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
