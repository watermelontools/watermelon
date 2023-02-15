import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

function VSCodeInsiders() {
  const [timeToRedirect, setTimeToRedirect] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeToRedirect(timeToRedirect - 1);
      if (timeToRedirect === 0) {
        window.open(
          `vscode-insiders://watermelontools.watermelon-tools?email=${
            data?.user?.email ?? ""
          }&token=${data?.user.name ?? ""}`,
          "_blank"
        );
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timeToRedirect]);
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
          href={`vscode-insiders://watermelontools.watermelon-tools?email=${
            data?.user?.email ?? ""
          }&token=${data?.user.name ?? ""}`}
        >
          <div className="d-flex flex-items-center flex-justify-center flex-column">
            <div
              className="Box d-flex flex-items-center flex-justify-center flex-column p-4 p-4 m-2"
              style={{ maxWidth: "80ch" }}
            >
              <h1 className="h3 mb-3 f4 text-normal">Open VSCode Insiders</h1>
              <p>You will be redirected in {timeToRedirect}...</p>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}

export default VSCodeInsiders;
