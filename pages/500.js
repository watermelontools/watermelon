import Link from "next/link";
import PageTitle from "../components/PageTitle";
import PagePadder from "../components/PagePadder";

function HomePage() {
  return (
    <>
      <PageTitle pageTitle="500" />
      <PagePadder>
        <div className="w-full flex flex-col justify-center items-center">
          <p>Server error - we broke something :(</p>
          <p>
            <Link href="/">
              <a>Go back home</a>
            </Link>
          </p>
        </div>
      </PagePadder>
    </>
  );
}

export default HomePage;
