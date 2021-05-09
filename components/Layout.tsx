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
      icon: "/svg/question",
      text: "Questions",
      route: "/weeklyquestions",
    },
    {
      icon: "/svg/settings",
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
          <nav className="md:w-3/12 lg:w-2/12 h-full flex-grow min-h-screen flex flex-col justify-between items-center bg-white sticky top-0 max-w-max shadow">
            <div className="flex flex-col h-full w-full">
              <div className="border-b-2 border-gray-400 border-solid	flex justify-center p-2">
                <Image
                  className="block"
                  src={"/imagotype-black.png"}
                  width={154}
                  height={52}
                  layout="fixed"
                />
              </div>
              <div className="p-2">
                {links.map((link, index) => (
                  <Link href={link.route} key={index}>
                    <a className="no-underline">
                      <div
                        className={`flex w-full py-4 px-2 justify-start items-center hover:pl-2 rounded`}
                        style={{
                          background: pathname === link.route
                            ? "linear-gradient(42deg, rgba(173,56,56,1) 0%, rgba(219,97,97,1) 50%, rgba(249,246,244,1) 99%)"
                            : "white"
                        }}
                      >
                        <Image
                          className="mx-1 block w-10"
                          src={`${link.icon}${pathname === link.route ? "" : "-dark"}.svg`}
                          width={24}
                          height={24}
                          layout="fixed"
                        />
                        <span className="mx-1 sm:hidden md:block lg:block text-gray-200">
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
