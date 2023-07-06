import Link from "next/link";

const sidebar = (
  <nav className="SideNav border">
    <Link className="SideNav-item" href="/">
      Home
    </Link>
    <Link className="SideNav-item" href="/settings" aria-current="page">
      Settings
    </Link>
    <Link className="SideNav-item" href="/billing">
      Billing
    </Link>
  </nav>
);
export default sidebar;
