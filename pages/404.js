import Link from "next/link";
import PageTitle from "../components/PageTitle";
import PagePadder from "../components/PagePadder";

function HomePage() {
  return (
    <>
      <PageTitle pageTitle="4🍉4!" />
      <PagePadder>
        <p>
          This page does not exist
        </p>
        <p><Link href="/"><a>Go back home</a></Link></p>
      </PagePadder>
    </>
  );
}

export default HomePage;
