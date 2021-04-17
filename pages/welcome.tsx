import Link from "next/link";
import { useEffect } from "react";
import PagePadder from "../components/PagePadder";
import PageTitle from "../components/PageTitle";

const Welcome = ({ firebaseApp, token }) => {
  let db = firebaseApp.firestore();

  console.log(token);
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
              Add <strong>@watermelon</strong> to a channel
          </li>
            <li>
              Use <strong>/ask</strong> to send the questions
          </li>
            <li>Have people answer them (you do it too, don’t miss the fun)</li>
            <li>
              Use <strong>/create</strong> and watch the groups be created!
          </li>
          </ol>
          <h3>Remember</h3>
          <p>Change the questions every week, we’ll send you a reminder</p>
        </div>
      </PagePadder>
    </>
  );
};
export default Welcome;
