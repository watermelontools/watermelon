const InfoPanel = ({ info }) => {
  const {
    organization,
    user_avatar_url,
    user_displayname,
    user_email,
    service_name,
  } = info;
  let trimmedOrg = (organization) => {
    if (
      organization === "" ||
      organization === null ||
      organization === undefined ||
      organization === "null"
    ) {
      return "Unknown organization";
    } else if (organization.length > 20) {
      return organization.substring(0, 20) + "...";
    } else {
      return organization.trim();
    }
  };
  return (
    <div className="Box" style={{ height: "100%" }}>
      <div className="Subhead px-3 pt-2">
        <h2 className="Subhead-heading d-flex flex-items-center flex-justify-start">
          <img
            className="avatar avatar-4"
            src={`/logos/${service_name.toLowerCase()}.svg`}
          />
          <span>{service_name}</span>
        </h2>
      </div>

      <div className="pl-3 pr-3 pt-1 pb-3" style={{ flex: 1 }}>
        <div className="d-flex flex-items-center">
          <img className="avatar avatar-8 mr-2" src={user_avatar_url} />

          <div style={{ flex: 1 }}>
            <h3>{user_displayname}</h3>
            <span className="text-gray">{user_email || "Unknown email"}</span>
            <p className="text-gray">{trimmedOrg(organization)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InfoPanel;
