"use client";
import { useState } from "react";

export default function sendInviteForm({ teamName, userEmail }) {
  const sendTeammateInviteEmail = async ({ email: receiverEmail }) => {
    setButtonDisabled(true);
    setButtonText("Sending...");
    const invitation = await fetch("/api/sendgrid/sendTeammateInvite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: userEmail,
        email: receiverEmail,
        teamName,
        inviteUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/team/invite/${teamName}`,
      }),
    });
    setButtonDisabled(false);
    setButtonText("Send Invite");
    return invitation;
  };
  let [buttonDisabled, setButtonDisabled] = useState(false);
  let [buttonText, setButtonText] = useState("Send Invite");
  return (
    <form
      className="my-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        console.log(email);
        await sendTeammateInviteEmail({ email });
      }}
    >
      <input
        className="form-control "
        type="email"
        placeholder={`Teammate@${teamName?.name.toLowerCase()}.com`}
        aria-label="Teammate email"
      />
      <button className="btn mx-2" type="submit" disabled={buttonDisabled}>
        {buttonText}
      </button>
    </form>
  );
}
