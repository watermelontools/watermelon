import Link from "next/link";

function VSCode() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <p>
        <Link href="vscode-insiders://WatermelonTools.watermelon">
          <a>vscode</a>
        </Link>
      </p>
    </div>
  );
}

export default VSCode;
