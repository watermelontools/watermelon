import AddTeammateButton from "./addTeammateButton";

async function loading({}) {
  const userEmail = "tulia@watermelontools.com";
  const teamName = { name: "watermelon" };
  const teammates = [
    { email: "edalel@watermelon.tools" },
    { email: "evargas@watermelon.tools" },
  ];
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
          <form action="">
            <input
              className="form-control "
              type="email"
              placeholder={`Teammate@${teamName.name.toLowerCase()}.com`}
              aria-label="Teammate email"
            />
            <button className="btn" type="button">
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

export default loading;
