const BitbucketInfo = (bitbucketUserData) => (
    <div className="Box">
      <div className="Subhead px-3">
        <h2 className="Subhead-heading">
          Bitbucket{" "}
          {bitbucketUserData.company ? `(${bitbucketUserData.company.trim()})` : ""}
        </h2>
      </div>
      <div className="d-flex flex-items-center flex-justify-start p-2">
        <img className="avatar avatar-8" src={bitbucketUserData.avatar_url} />
        <div className="px-2">
          <h3>{bitbucketUserData.name}</h3>
          <p className="text-light">{bitbucketUserData.email}</p>
        </div>
      </div>
    </div>
  );
  export default BitbucketInfo;
  