import Link from "next/link";
import HeaderSignOut from "./HeaderSignOut";

export default function Navbar({ children }: { children: React.ReactNode }) {
  const links = [
    { href: "/", label: "Home" },
    { href: "/settings", label: "Settings" },
    { href: "/team", label: "Team" },
    { href: "/https://calendly.com/evargas-14/watermelon-business", label: "Billing" },
  ];
  return (
    <div
      className="d-flex flex-row"
      style={{ height: "max(calc(100vh - 64px), 100%)" }}
    >
      <nav className="SideNav border">
        <div
          className="d-flex flex-column flex-justify-between flex-content-between"
          style={{
            minHeight: "calc(100vh - 64px)",
            position: "sticky",
            top: 0,
            zIndex: 2,
            backgroundColor: "var(--color-canvas-subtle)",
          }}
        >
          <div>
            {links.map(({ href, label }) => (
              <Link href={href} key={href} className="SideNav-item">
                {label}
              </Link>
            ))}
          </div>
          <div className="flex-self-end">
            <HeaderSignOut />
          </div>
        </div>
      </nav>
      <div style={{ width: "100%" }}>{children}</div>
    </div>
  );
}
