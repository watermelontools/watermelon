import { getServerSession } from "next-auth";

import getTeammates from "../../utils/db/teams/getTeammates";
import getUserTeam from "../../utils/db/teams/getUserTeam";
import sendTeammateInvite from "../../utils/sendgrid/sendTeammateInvite";

import { authOptions } from "../api/auth/[...nextauth]/route";
import AddTeammateButton from "./addTeammateButton";

async function Team({}) {
  const session = await getServerSession(authOptions);
  const { email: userEmail, name: userName } = session?.user ?? {};
  const [teammates, teamName] = await Promise.all([
    getTeammates({ watermelon_user: userName }),
    getUserTeam({ watermelon_user: userName }),
  ]);
  const sendTeammateInviteEmail = async ({ email: receiverEmail }) => {
    const invitation = sendTeammateInvite({
      sender: userEmail || "info@watermelon.tools",
      email: receiverEmail,
      teamName,
      inviteUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/team/invite/{teamName`,
    });
    console.log(invitation);
    return invitation;
  };
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
          <AddTeammateButton teamName={teamName.name} />
          <form
            className="my-2"
            onSubmit={(e) => {
              e.preventDefault();
              const email = e.target[0].value;
              sendTeammateInviteEmail({ email });
            }}
          >
            <input
              className="form-control "
              type="email"
              placeholder={`Teammate@${teamName.name.toLowerCase()}.com`}
              aria-label="Teammate email"
            />
            <button className="btn mx-2" type="button">
              Send Invite
            </button>
          </form>
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

export default Team;
