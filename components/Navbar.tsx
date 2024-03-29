import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Navbar({ children }: { children: React.ReactNode }) {
  const links = [
    { href: "/", label: "Home" },
    { href: "/settings", label: "Settings" },
    { href: "/team", label: "Team" },
    {
      href: "https://buy.stripe.com/28o0289KVaYV5wY004",
      label: "Billing",
    },
    { href: "/api/auth/signout", label: "Logout", onClick: signOut },
  ];
  return (
    <div className="d-flex flex-row h-full" style={{ minHeight: "90vh" }}>
      <nav
        className="SideNav shadow-md"
        style={{ width: 250, minHeight: "100%" }}
      >
        <div
          className="flex flex-col justify-between h-full bg-gray-100 p-4"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 2,
          }}
        >
          <div>
            {links.map(({ href, label }) => (
              <Link
                href={href}
                key={href}
                className="SideNav-item block py-2 pr-6 px-4 rounded-md text-gray-700 hover:bg-gray-200 transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="flex-1 p-4">
        <div style={{ width: "100%" }}>{children}</div>
      </div>
    </div>
  );
}
