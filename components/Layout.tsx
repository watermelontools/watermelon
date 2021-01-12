import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import useCheckLogin from "../hooks/useCheckLogin";
import { useEffect } from "react";
const Layout = ({ children }) => {
  const router = useRouter();
  let { pathname } = router;
  useEffect(() => {
    let { isLoggedIn, hasAddedToSlack } = useCheckLogin();
    console.log(isLoggedIn);
    console.log(hasAddedToSlack);
    if (!isLoggedIn) router.push("/login");
    else if (!hasAddedToSlack) router.push("/welcome");
  }, []);
  const links = [
    {
      icon: "/svg/dashboard.svg",
      text: "Dashboard",
      route: "/",
    },
    {
      icon: "/svg/settings.svg",
      text: "Settings",
      route: "/settings",
    },
    {
      icon: "/svg/question.svg",
      text: "Weekly Questions",
      route: "/weeklyquestions",
    },
  ];
  return (
    <div className="w-screen h-full min-h-screen">
      <div className="w-full h-full flex min-h-screen ">
        <nav className="w-2/12 h-full flex-grow min-h-screen border-r border-pink-400 flex flex-col justify-between items-center bg-red-50 sticky top-0 max-w-max pt-2">
          <div className="flex flex-col h-full w-full">
            <span className="font-bold mb-2 text-green-800 text-xl">
              🍉 Admin
            </span>
            {links.map((link, index) => (
              <Link href={link.route} key={index}>
                <a>
                  <div
                    className={`flex w-full py-4 px-2 justify-start items-center hover:bg-pink-300
                      ${
                        pathname === link.route
                          ? "bg-pink-200 border-pink-700 border-l-2"
                          : ""
                      }`}
                  >
                    <Image
                      className="mx-1 block w-10"
                      src={link.icon}
                      width={24}
                      height={24}
                      layout="fixed"
                    />
                    <span className="mx-1 sm:hidden md:block lg:block">
                      {link.text}
                    </span>
                  </div>
                </a>
              </Link>
            ))}
          </div>
          <button className="bg-pink-200 text-red-500 w-full">Logout</button>
        </nav>
        <div className="w-10/12 h-full p-2 pl-6 pt-3">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
