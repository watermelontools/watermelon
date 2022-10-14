import Link from "next/link";
import { useSession, signIn } from "next-auth/react";

function VSCode() {
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
          href={`vscode://watermelontools.watermelon-tools?email=${
            data?.user?.email ?? ""
          }&token=${data?.user.name ?? ""}`}
        >
          <a>Open VSCode</a>
        </Link>
      )}
    </div>
  );
}

export default VSCode;
