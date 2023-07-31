import { getServerSession } from "next-auth";

import LogInBtn from "../../components/login-btn";

import { authOptions } from "../api/auth/[...nextauth]/route";

async function Settings({}) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  // if not logged in, do not show anything
  if (!session) return <LogInBtn />;

  const formState = {
    JiraTickets: 3,
    SlackMessages: 3,
    GitHubPRs: 3,
    NotionPages: 3,
    LinearTickets: 3,
    ConfluenceDocs: 3,
    AISummary: 1,
  };
  function SettingsSelector({ label, value, defaultValue }) {
    return (
      <div className="">
        <span>{label}</span>
        <select
          className="form-select"
          aria-label={label}
          defaultValue={defaultValue}
          value={value}
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
            <SettingsSelector
              label="Jira Tickets"
              value={formState.JiraTickets}
              defaultValue={formState?.JiraTickets}
            />
            <SettingsSelector
              label="Slack Messages"
              value={formState.SlackMessages}
              defaultValue={formState?.SlackMessages}
            />
            <SettingsSelector
              label="GitHub PRs"
              value={formState.GitHubPRs}
              defaultValue={formState?.GitHubPRs}
            />
            <SettingsSelector
              label="Notion Pages"
              value={formState.NotionPages}
              defaultValue={formState?.NotionPages}
            />
            <SettingsSelector
              label="Linear Tickets"
              value={formState.LinearTickets}
              defaultValue={formState?.LinearTickets}
            />
            <SettingsSelector
              label="Confluence Docs"
              value={formState.ConfluenceDocs}
              defaultValue={formState?.ConfluenceDocs}
            />

            <div className="">
              <span>AI Summary: </span>
              <select
                className="form-select"
                aria-label="AI Summary"
                defaultValue={formState?.AISummary}
                value={formState.AISummary}
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
            <button className="btn btn-primary" type="button" disabled={false}>
              {"Save"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
