const useCheckLogin = () => {
  let isLoggedIn = false;
  if (typeof window !== "undefined") {
    isLoggedIn = window?.localStorage?.getItem("sign_in_token");
  }
  return { isLoggedIn  };
};
export default useCheckLogin;
