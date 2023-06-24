import { useSession, signOut } from "next-auth/react";
export default function Component() {
  const { data: session } = useSession();
  return (
    <>
      <p>Signed in as {session?.user?.email}</p>
      <button className="btn" onClick={() => signOut()}>
        Sign out
      </button>
    </>
  );
}
