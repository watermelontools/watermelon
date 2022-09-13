import Image from "next/image";
export default function Header() {
  return (
    <div className="Header">
      <div className="Header-item">
        <Image
          src="/logos/watermelon.svg"
          alt="Watermelon Tools"
          width="32"
          height="32"
        />
      </div>
      <div className="Header-item mr-0">
        <div>
          <details className="dropdown details-reset details-overlay d-inline-block">
            <summary className="btn" aria-haspopup="true">
              Dropdown
              <div className="dropdown-caret"></div>
            </summary>

            <ul className="dropdown-menu dropdown-menu-se">
              <li>
                <a className="dropdown-item" href="#url">
                  Dropdown item
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#url">
                  Dropdown item
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#url">
                  Dropdown item
                </a>
              </li>
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
}
