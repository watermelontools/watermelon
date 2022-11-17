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
          <a>Open VSCodium</a>
        </Link>
      )}
    </div>
  );
}

export default VSCodeInsiders;
