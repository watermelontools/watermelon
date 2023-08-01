import { getServerSession } from "next-auth";
import Link from "next/link";
import executeRequest from "../../../../utils/db/azuredb";
import { authOptions } from "../../../api/auth/[...nextauth]/route";

async function teamInviteLanding({ params }: { params: { teamName: string } }) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  await executeRequest(
    `EXEC [dbo].[add_user_to_team] @watermelon_user = '${userEmail}', @teamName = '${params.teamName}';`
  );

  return (
    <div>
      <div className="p-3">
        <h1>Team</h1>
        <div className="">
          <div className="Subhead">
            <h2 className="Subhead-heading">
              You have been added to team {params.teamName}{" "}
            </h2>
            <div className="Subhead-description">Congratulations!</div>
          </div>
          <div>
            <p>
              Your email ({userEmail}) is now linked to the team,{" "}
              <Link href={"/"}>please connect your accounts</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default teamInviteLanding;
