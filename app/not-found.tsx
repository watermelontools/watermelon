import Link from "next/link";
import Image from "next/image";
export default async function NotFound() {
  return (
    <div>
      <h1>Not Found</h1>
      <p>something went wrong!</p>
      <p>
        View <Link href="/">Go back home</Link>
      </p>
      <div>
        <Image
          src="/pingpong.png"
          width={500}
          height={500}
          alt={"Ping pong communication broke the server"}
        />
      </div>
    </div>
  );
}
