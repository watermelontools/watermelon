import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

function VSCodeInsiders() {
  const { status, data } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });
  const [timeToRedirect, setTimeToRedirect] = useState(10);
  let system = "vscode";
  let url: string = `${system}://watermelontools.watermelon-tools?email=${
    data?.user?.email ?? ""
  }&token=${data?.user.name ?? ""}`;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeToRedirect(timeToRedirect - 1);
      if (timeToRedirect === 0) {
        window.open(url, "_blank");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timeToRedirect]);

  return (
    <div className="d-flex flex-items-center flex-justify-center">
      {status !== "loading" && (
        <Link href={url}>
          <div className="d-flex flex-items-center flex-justify-center flex-column">
            <div
              className="Box d-flex flex-items-center flex-justify-center flex-column p-4 p-4 m-2"
              style={{ maxWidth: "80ch" }}
            >
              <h1 className="h3 mb-3 f4 text-normal"> Open VSCodium</h1>
              {timeToRedirect > 0 ? (
                <p>We will try opening it in {timeToRedirect}...</p>
              ) : null}
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}

export default VSCodeInsiders;
