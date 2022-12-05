import Link from "next/link";

const DownloadExtension = ({ name, email, accessToken }) => (
  (<Link
    href={`vscode://watermelontools.watermelon-tools?email=${
      email ?? ""
    }&token=${accessToken ?? ""}`}
    className="Box d-flex flex-items-center flex-justify-start p-2">

    <img
      className="avatar avatar-8"
      src={`/logos/${name.toLowerCase()}.svg`}
    />
    <div className="p-2">
      <h2>{name}</h2>
      <p>Download Watermelon</p>
    </div>

  </Link>)
);
export default DownloadExtension;
