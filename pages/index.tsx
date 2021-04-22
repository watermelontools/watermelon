import Link from "next/link";
import PageTitle from "../components/PageTitle";
import PagePadder from "../components/PagePadder";

function HomePage() {
  return (
    <PagePadder>
      <PageTitle pageTitle="Welcome to Watermelon🍉!" />
      <p>
        Watermelon is the best way to connect your coworkers through shared
        interests.
      </p>
      <p>You can change the language and question type over at <Link href="/settings"><a>Settings</a></Link></p>
      <p>You can view a selection of questions at <Link href="/weeklyQuestions"><a>Questions</a></Link></p>
      <p>(Coming soon)Understand your workspace</p>
    </PagePadder>
  );
}

export default HomePage;
