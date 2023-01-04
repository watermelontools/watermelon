const InfoPanel = ({ info }) => {
  const {
    organization,
    user_avatar_url,
    user_displayname,
    user_email,
    service_name,
  } = info;
  return (
    <div className="Box">
      <div className="Subhead px-3">
        <h2 className="Subhead-heading d-flex flex-items-center flex-justify-start">
          <img
            className="avatar avatar-4"
            src={`/logos/${service_name.toLowerCase()}.svg`}
          />
          <span>
            {service_name} {organization ? `(${organization.trim()})` : ""}
          </span>
        </h2>
      </div>
      <div className="d-flex flex-items-center flex-justify-start p-2">
        <img className="avatar avatar-8" src={user_avatar_url} />
        <div className="px-2">
          <h3>{user_displayname}</h3>
          <p className="text-light">{user_email} </p>
        </div>
      </div>
    </div>
  );
};
export default InfoPanel;
