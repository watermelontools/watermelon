import Link from "next/link";

async function teamInviteLanding({ params }: { params: { teamName: string } }) {
  let userEmail = "tulia@watermelontools.com";

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
