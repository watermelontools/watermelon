const JiraLoginLink = ({ name }) => (
  <div className="Box d-flex flex-items-center flex-justify-start p-2">
    <img
      className="avatar avatar-8"
      src={`/logos/${name.toLowerCase()}.svg`}
      style={{
        filter: "grayscale(100%)",
      }}
    />
    <div className="p-2">
      <h2>{name}</h2>
      <p>Coming soon!</p>
    </div>
  </div>
);
export default JiraLoginLink;
