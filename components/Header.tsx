import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
export default function Header() {
  const [userEmail, setUserEmail] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    setUserEmail(session?.user?.email);
  }, [session]);
  return (
    <div className="Header d-flex flex-items-center flex-justify-between">
      <div className="Header-item">
        <Image
          src="/logos/watermelon.png"
          alt="Watermelon Tools"
          width="36"
          height="23"
        />
      </div>
      <div className="Header-item mr-0">
        <div>
          <details className="dropdown details-reset details-overlay d-inline-block">
            <summary className="btn" aria-haspopup="true">
              Account
              <div className="dropdown-caret"></div>
            </summary>

            <ul className="dropdown-menu dropdown-menu-sw">
              <li>
                <a className="dropdown-item" href="#url">
                  {userEmail}
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="vscode://watermelontools.watermelon-tools"
                >
                  VSCode Extension
                </a>
              </li>
              <li className="d-flex flex-items-center flex-justify-center">
                <button className="btn" onClick={() => signOut()}>
                  Sign out
                </button>
              </li>
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
}
