import Link from "next/link";

function NotFoundPage() {
  return (
    <div className="d-flex flex-items-center flex-justify-center">
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
