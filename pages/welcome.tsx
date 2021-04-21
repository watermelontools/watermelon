import Link from "next/link";
import { useEffect, useState } from "react";
import PagePadder from "../components/PagePadder";
import PageTitle from "../components/PageTitle";

const Welcome = ({ firebaseApp, token }) => {
  const [addToSlackToken, setAddToSlackToken] = useState(undefined)
  useEffect(() => {
    setAddToSlackToken(JSON.parse(window.localStorage.getItem("add_to_slack_token")))
  }, [])
  return (
    <>
      <PageTitle pageTitle="Congratulations" />
      <PagePadder>
        <div className="rounded shadow p-4">
          <p>✅You are ready to go!</p>
          <p>
            You may set questions over at{" "}
            <Link href="/weeklyquestions">
              <a>questions</a>
            </Link>
          , but we have added a couple for you 😉
        </p>
          <h3>In Slack:</h3>
          <ol>
            <li>
              Use <strong>/ask</strong> to send the questions
          </li>
            <li>Have people answer them (you do it too, don’t miss the fun!)</li>
            <li>
              Use <strong>/create</strong> and watch the groups be created!
          </li>
          </ol>
          <a
            className="px-4 text-base rounded shadow-sm text-white bg-green-400"
            href={`slack://app?team=${addToSlackToken?.team?.id}&id=${addToSlackToken?.app_id}`}>Start using Watermelon</a>
        </div>
      </PagePadder>
    </>
  );
};
export default Welcome;
