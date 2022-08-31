import Link from "next/link";

function VSCodeInsiders() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <p>
        <Link href="vscode-insiders://watermelontools.watermelon-tools">
          <a>vscode</a>
        </Link>
      </p>
    </div>
  );
}

export default VSCodeInsiders;
