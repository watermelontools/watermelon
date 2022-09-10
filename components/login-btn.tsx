import { useSession, signIn, signOut } from "next-auth/react";
import { Button, Box } from "@primer/react";
export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <Button onClick={() => signOut()}>Sign out</Button>
      </>
    );
  }
  return (
    <Box>
      <Button variant="primary" onClick={() => signIn()}>
        Sign in
      </Button>
    </Box>
  );
}
