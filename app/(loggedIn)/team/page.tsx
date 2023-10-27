import { getServerSession } from "next-auth";

import getTeammates from "../../../utils/db/teams/getTeammates";
import getUserTeam from "../../../utils/db/teams/getUserTeam";

import { authOptions } from "../../api/auth/[...nextauth]/route";
import AddTeammateButton from "./addTeammateButton";
import SendInviteForm from "./sendInviteForm";

async function Team({}) {
  const session = await getServerSession(authOptions);
  const { email: userEmail, name: userName } = session?.user ?? {};
  const [teammates, teamName] = await Promise.all([
    getTeammates({ watermelon_user: userName }),
    getUserTeam({ watermelon_user: userName }),
  ]);

  return (
    <div className="Box">
      <div className="Subhead px-3 py-2">
        <h2 className="Subhead-heading">Team</h2>
      </div>

      <div className="p-3" style={{ flex: 1 }}>
        <div className="mb-4">
          <h3 className="Subhead-heading">My Account</h3>

          <div className="text-gray">{userEmail}</div>
        </div>

        <div>
          <h3 className="Subhead-heading">My Team</h3>

          <AddTeammateButton teamName={teamName.name} />

          <SendInviteForm teamName={teamName.name} userEmail={userEmail} />

          <h4 className="mt-4 mb-2">Teammates</h4>

          {teammates?.length && (
            <div>
              {teammates?.map((teammate) => (
                <div key={teammate.email} className="text-gray">
                  {teammate.email}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Team;
