import { getServerSession } from "next-auth";

import getTeammates from "../../utils/db/teams/getTeammates";
import getUserTeam from "../../utils/db/teams/getUserTeam";

import { authOptions } from "../api/auth/[...nextauth]/route";
import AddTeammateButton from "./addTeammateButton";

async function Settings({}) {
  const session = await getServerSession(authOptions);
  let userEmail = session?.user?.email;
  let userName = session?.user?.name;
  const teammates = await getTeammates({ watermelon_user: userName });
  const teamName = getUserTeam({ watermelon_user: userName });
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
          <AddTeammateButton teamName={teamName} />
          {teammates?.length && (
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
