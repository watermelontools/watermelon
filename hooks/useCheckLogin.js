const useCheckLogin = () => {
  let isLoggedIn = false;
  let hasAddedToSlack = false;
  console.log("checking")
  if (typeof window !== "undefined") {
    isLoggedIn = window?.localStorage?.getItem("sign_in_token");
    hasAddedToSlack = window?.localStorage?.getItem("add_to_slack_token");
  }
  console.log("hats", hasAddedToSlack)
  console.log("sit",isLoggedIn)
  return { isLoggedIn, hasAddedToSlack };
};
export default useCheckLogin;
