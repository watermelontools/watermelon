"use client";
import { signOut } from "next-auth/react";
export default function HeaderSignOut() {
  return (
    <button className="btn" onClick={() => signOut()}>
      Sign out
    </button>
  );
}
