import Link from "next/link";
import { useEffect } from "react";
import PagePadder from "../components/PagePadder";
import PageTitle from "../components/PageTitle";

const Welcome = ({ firebaseApp, token }) => {
  let addToSlackToken
  useEffect(() => {
    addToSlackToken = JSON.parse(window.localStorage.getItem("add_to_slack_token"))
    console.log(addToSlackToken)
    console.log(addToSlackToken.team)
    console.log(addToSlackToken.team.id)
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
          {addToSlackToken?.team?.id
            ? <a href={`slack://app?team=${addToSlackToken.team.id}&id=${addToSlackToken.app_id}`}>Start using Watermelon</a>
            : null}
        </div>
      </PagePadder>
    </>
  );
};
export default Welcome;
