import Link from "next/link";

export default function Navbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="d-flex flex-row" style={{ height: "98vh" }}>
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
      <div style={{ width: "100%" }}>{children}</div>
    </div>
  );
}
