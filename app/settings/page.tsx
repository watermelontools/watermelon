import { getServerSession } from "next-auth";

import LogInBtn from "../../components/login-btn";

import { authOptions } from "../api/auth/[...nextauth]/route";
import Form from "./form";

async function Settings({}) {
  const session = await getServerSession(authOptions);
  let userEmail = session?.user?.email;
  let userName = session?.user?.name;
  // if not logged in, do not show anything
  if (!session) return <LogInBtn />;

  return (
    <div>
      <div className="p-3">
        <h2>Settings</h2>
        <div className="">
          <div className="Subhead">
            <span className="Subhead-heading">App Settings</span>
            <div className="Subhead-description">
              This controls how the GitHub App behaves.
            </div>
          </div>

          <Form userEmail={userEmail} />
        </div>
      </div>
    </div>
  );
}

export default Settings;
