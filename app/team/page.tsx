import { getServerSession } from "next-auth";

import LogInBtn from "../../components/login-btn";
import getTeammates from "../../utils/db/teams/getTeammates";

import { authOptions } from "../api/auth/[...nextauth]/route";

async function Settings({}) {
  const session = await getServerSession(authOptions);
  let userEmail = session?.user?.email;
  let userName = session?.user?.name;
  // if not logged in, do not show anything
  if (!session) return <LogInBtn />;
  const teammates = await getTeammates({ watermelon_user: userName });
  console.log(teammates);
  return (
    <div>
      <div className="p-3">
        <h1>Team</h1>
        <div className="">
          <div className="Subhead">
            <h2 className="Subhead-heading">My Account</h2>
            <div className="Subhead-description">Control your own account</div>
          </div>
          <div>
            <p>{userEmail}</p>
          </div>
        </div>
        <div className="">
          <div className="Subhead">
            <h2 className="Subhead-heading">My Team</h2>
            <div className="Subhead-description">
              View and invite people you work with
            </div>
          </div>
          <button>Add Teammate</button>
          {teammates.length && (
            <div>
              {teammates.map((teammate) => {
                return (
                  <div key={teammate.email}>
                    <p>{teammate.email}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
