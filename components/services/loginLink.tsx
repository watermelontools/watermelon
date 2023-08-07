import Link from "next/link";

const ServiceLoginLink = ({ link, logoName, serviceName, serviceText }) => (
  <div className="Box">
    <Link href={link} className="button block">
      <div className="Box d-flex flex-items-center flex-justify-start p-2">
        <img className="avatar avatar-8" src={`/logos/${logoName}.svg`} />
        <div className="p-2">
          <h2>Login to {serviceName}</h2>
          <p>{serviceText}</p>
        </div>
      </div>
    </Link>
  </div>
);
export default ServiceLoginLink;
