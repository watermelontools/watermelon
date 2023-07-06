"use client";

import { useState } from "react";

export default function addTeammateButton({ teamName }) {
  // onclick should copy to the clipboard the link to invite a teammate
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="btn btn-primary"
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(
          `https://${process.env.NEXT_PUBLIC_BACKEND_URL}/team/invite/${teamName}`
        );
        setCopied(true);
      }}
    >
      {copied ? "Copied to clipboard 🍉" : "Invite Teammate"}
    </button>
  );
}
