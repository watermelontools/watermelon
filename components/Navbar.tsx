"use client";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  console.log(session);

  if (!session) {
    return null;
  }

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
