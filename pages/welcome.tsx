import Link from "next/link";
import { useEffect, useState } from "react";
import PagePadder from "../components/PagePadder";
import PageTitle from "../components/PageTitle";

const Welcome = ({ firebaseApp, token }) => {
  const [loginToken, setLoginToken] = useState(undefined)
  useEffect(() => {
    setLoginToken(JSON.parse(window.localStorage.getItem("sign_in_token")))
  }, [])
  return (
    <>
      <PageTitle pageTitle="Congratulations" />
      <PagePadder>
        <div className="rounded shadow p-4">
          <p>✅You are ready to go!</p>
          <br />
          <p>We'll post the questions soon, stay tuned!</p>

          <br />
          <p>Rememeber you can change your <Link href="/settings"><a>settings</a></Link></p>
        </div>
      </PagePadder>
    </>
  );
};
export default Welcome;
