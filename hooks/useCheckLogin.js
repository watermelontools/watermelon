import { useRouter } from "next/router";
import { useEffect } from "react";

function useCheckLogin() {
  let isLoggedIn = false;
  let hasAddedToSlack = false;
  let router;
  useEffect(() => {
    router = useRouter();
    isLoggedIn = window?.localStorage?.getItem("sign_in_token");
    hasAddedToSlack = window?.localStorage?.getItem("add_to_slack_token");
    if (!isLoggedIn) router.push("/login");
    if (!hasAddedToSlack) router.push("/welcome");
  }, []);
  return { isLoggedIn, hasAddedToSlack };
}
export default useCheckLogin;
