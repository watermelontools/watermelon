import Link from "next/link";

export default function Navbar({ children }: { children: React.ReactNode }) {
  const links = [
    { href: "/", label: "Home" },
    { href: "/settings", label: "Settings" },
    { href: "/team", label: "Team" },
  ];
  return (
    <div className="d-flex flex-row" style={{ height: "98vh" }}>
      <nav className="SideNav border">
        {links.map(({ href, label }) => (
          <Link href={href} key={href} className="SideNav-item">
            {label}
          </Link>
        ))}
      </nav>
      <div style={{ width: "100%" }}>{children}</div>
    </div>
  );
}
