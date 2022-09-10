import { signIn } from "next-auth/react";
export default function Component() {
  return (
    <div className="d-flex flex-items-center flex-justify-center flex-column">
      <div
        className="Box d-flex flex-items-center flex-justify-center flex-column p-4 p-4 m-2"
        style={{ maxWidth: "80ch" }}
      >
        <h1 className="h3 mb-3 f4 text-normal">Watermelon Auth</h1>
        <p className="text-gray mb-4">
          Sign in to Watermelon Auth to access all services
        </p>
        <button className="btn btn-primary" onClick={() => signIn()}>
          Sign in
        </button>
      </div>
    </div>
  );
}
