import Link from "next/link";

function ServerErrorPage() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <p>The server ran into an error</p>
      <p>
        <Link href="/">
          <a>Go back home</a>
        </Link>
      </p>
    </div>
  );
}

export default ServerErrorPage;
