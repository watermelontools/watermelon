import Link from "next/link";
import PageTitle from "../components/PageTitle";
import PagePadder from "../components/PagePadder";

function HomePage() {
  return (
    <>
      <PageTitle pageTitle="500" />
      <PagePadder>
        <p>
          Server error - we broke something :(
        </p>
        <p><Link href="/"><a>Go back home</a></Link></p>
      </PagePadder>
    </>
  );
}

export default HomePage;
