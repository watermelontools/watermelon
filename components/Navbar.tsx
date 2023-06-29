import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="SideNav border">
      {" "}
      <Link className="SideNav-item" href="/">
        Home
      </Link>
      <Link className="SideNav-item" href="/settings">
        Settings
      </Link>
      <Link className="SideNav-item" href="/team">
        Team
      </Link>
      <Link className="SideNav-item" href="/billing">
        Billing
      </Link>
    </nav>
  );
}
