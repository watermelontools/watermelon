import { getServerSession } from "next-auth";

import LogInBtn from "../../components/login-btn";

import { authOptions } from "../api/auth/[...nextauth]/route";

async function Settings({}) {
  const session = await getServerSession(authOptions);
  let userEmail = session?.user?.email;
  // if not logged in, do not show anything
  if (!session) return <LogInBtn />;

  const formState = {
    JiraTickets: 3,
    SlackMessages: 3,
    GitHubPRs: 3,
    NotionPages: 3,
    AISummary: 1,
  };
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
            <div className="">
              <span>Jira Tickets: </span>
              <select
                className="form-select"
                aria-label="Amount of Jira Tickets"
                defaultValue={formState?.JiraTickets}
                value={formState.JiraTickets}
              >
                {Array.from(Array(6)).map((i, index) => {
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
                defaultValue={formState?.SlackMessages}
                value={formState.SlackMessages}
              >
                {Array.from(Array(6)).map((i, index) => {
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
                defaultValue={formState?.GitHubPRs}
                value={formState.GitHubPRs}
              >
                {Array.from(Array(6)).map((i, index) => {
                  if (index === 0) {
                    return null;
                  }
                  return <option value={index}>{index}</option>;
                })}
              </select>
            </div>

            <div className="">
              <span>Notion Pages:</span>
              <select
                className="form-select"
                aria-label="Amount of Notion Pages"
                defaultValue={formState?.NotionPages}
                value={formState.NotionPages}
              >
                {Array.from(Array(6)).map((i, index) => {
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
                defaultValue={formState?.AISummary}
                value={formState.AISummary}
              >
                <option value={1}>Active</option>;
                <option value={0}>Inactive</option>;
              </select>
            </div>
            <button className="btn btn-primary" type="button" disabled={true}>
              "Save"
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
