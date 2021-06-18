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
          <h3>In any Slack channel:</h3>
          <ol>
            <li>
              Type <strong>/watermelon-ask</strong> to send questions
              <img src="/watermelon-ask.gif" />
            </li>
            <br />
            <li>
              Have people answer them (you do it too, don’t miss the fun!)
                <img src="/watermelon-respond.gif" />
            </li>
            <br />
            <li>
              Type <strong>/watermelon-create</strong> and let the fun begin!
              <img src="/watermelon-create.gif" />
            </li>
          </ol>
          <br />
          <div className="my-2">
            <a
              className="py-2 px-4 text-base rounded shadow-sm text-white bg-green-400"
              href={`slack://app?team=${loginToken?.team?.id}&id=${loginToken?.app_id}`}>
              Start using Watermelon🍉
          </a>
          </div>
        </div>
      </PagePadder>
    </>
  );
};
export default Welcome;
