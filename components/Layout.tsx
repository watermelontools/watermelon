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

    if (!isLoggedIn) router.push("/login");
    else if (!hasAddedToSlack && !router.pathname.includes("firstAuth"))
      router.push("/firstAuth");
  }, []);
  const links = [
    {
      icon: "/svg/question.svg",
      text: "Weekly Questions",
      route: "/weeklyquestions",
    },
    {
      icon: "/svg/settings.svg",
      text: "Settings",
      route: "/settings",
    },
  ];
  const isInitialFlow: boolean =
    router.pathname.includes("login") || router.pathname.includes("firstAuth");
  return (
    <div className="w-screen h-full min-h-screen">
      <div className="w-full h-full flex min-h-screen ">
        {!isInitialFlow && (
          <nav className="md:w-3/12 lg:w-2/12 h-full flex-grow min-h-screen border-r flex flex-col justify-between items-center bg-gray-700 sticky top-0 max-w-max">
            <div className="flex flex-col h-full w-full">
              <div className="bg-gray-900 flex justify-center">
                <Image
                  className="block"
                  src={"/imagotype-white.png"}
                  width={154}
                  height={52}
                  layout="fixed"
                />
              </div>
              <div className="p-2">
                {links.map((link, index) => (
                  <Link href={link.route} key={index}>
                    <a>
                      <div
                        className={`flex w-full py-4 px-2 justify-start items-center hover:bg-gray-800 rounded
                      ${pathname === link.route
                            ? "bg-gray-900 border-pink-700 border-l-2"
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
                        <span className="mx-1 sm:hidden md:block lg:block text-gray-300">
                          {link.text}
                        </span>
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                window.localStorage.removeItem("sign_in_token");
                window.localStorage.removeItem("add_to_slack_token");
                router.push("/login");
              }}
              className="bg-gray-600 text-gray-200 w-full"
            >
              Logout
            </button>
          </nav>
        )}
        <div
          className={`${isInitialFlow ? "w-full" : "lg:w-10/12 md:w-9/12"
            } h-full`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
