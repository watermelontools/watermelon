"use client";

export default function addTeammateButton({ teamName }) {
  // onclick should copy to the clipboard the link to invite a teammate
  console.log(teamName);
  return (
    <button
      className="btn btn-primary"
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(
          `https://${process.env.NEXT_PUBLIC_BACKEND_URL}/team/invite/${teamName}`
        );
      }}
    >
      Add Teammate
    </button>
  );
}
