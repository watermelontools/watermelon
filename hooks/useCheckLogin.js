import { useRouter } from "next/router";
import { useEffect } from "react";

function useCheckLogin() {
  let isLoggedIn = false;
  let hasAddedToSlack = false;
  if (typeof window !== "undefined") {
    isLoggedIn = window?.localStorage?.getItem("sign_in_token");
    hasAddedToSlack = window?.localStorage?.getItem("add_to_slack_token");
  }
  return { isLoggedIn, hasAddedToSlack };
}
export default useCheckLogin;
