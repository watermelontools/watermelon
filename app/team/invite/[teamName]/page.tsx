import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "../../../api/auth/[...nextauth]/route";

async function teamInviteLanding({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  let userEmail = session?.user?.email;
  let userName = session?.user?.name;

  return (
    <div>
      <div className="p-3">
        <h1>Team</h1>
        <div className="">
          <div className="Subhead">
            <h2 className="Subhead-heading">
              You have been added to team {params.slug}{" "}
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
