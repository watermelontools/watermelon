import Link from "next/link";

export default function Navbar({ children }: { children: React.ReactNode }) {
  const links = [
    { href: "/", label: "Home" },
    { href: "/settings", label: "Settings" },
    { href: "/team", label: "Team" },
    { href: "/billing", label: "Billing" },
  ];
  return (
    <div className="d-flex flex-row" style={{ height: "100%" }}>
      <nav className="SideNav border">
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            backgroundColor: "var(--color-canvas-subtle)",
          }}
        >
          {links.map(({ href, label }) => (
            <Link href={href} key={href} className="SideNav-item">
              {label}
            </Link>
          ))}
        </div>
      </nav>
      <div style={{ width: "100%" }}>{children}</div>
    </div>
  );
}
