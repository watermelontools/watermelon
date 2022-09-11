import Link from "next/link";

function NotFoundPage() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <p>This page does not exist</p>
      <p>
        <Link href="/">
          <a>Go back home</a>
        </Link>
      </p>
    </div>
  );
}

export default NotFoundPage;
