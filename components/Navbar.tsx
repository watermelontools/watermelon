"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [userEmail, setUserEmail] = useState<string | null | undefined>(null);
  const { data } = useSession();

  useEffect(() => {
    setUserEmail(data?.user?.email);
  }, [data]);
  if (!userEmail) return null;
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
