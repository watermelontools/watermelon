import Link from "next/link";
import { useSession, signIn } from "next-auth/react";

function VSCodeInsiders() {
  const { status, data } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });
  return (
    <div className="d-flex flex-items-center flex-justify-center">
      {status !== "loading" && (
        <Link
          href={`vscodium://watermelontools.watermelon-tools?email=${
            data?.user?.email ?? ""
          }&token=${data?.user.name ?? ""}`}
        >
          <div className="d-flex flex-items-center flex-justify-center flex-column">
            <div
              className="Box d-flex flex-items-center flex-justify-center flex-column p-4 p-4 m-2"
              style={{ maxWidth: "80ch" }}
            >
              <h1 className="h3 mb-3 f4 text-normal"> Open VSCodium</h1>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}

export default VSCodeInsiders;
