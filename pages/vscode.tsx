import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import Router from "next/router";

function VSCode() {
  const { status, data } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <p>
        {status !== "loading" && (
          <Link
            href={`vscode://watermelontools.watermelon-tools?email=${
              data?.user?.email ?? ""
            }`}
          >
            <a>vscode</a>
          </Link>
        )}
      </p>
    </div>
  );
}

export default VSCode;
