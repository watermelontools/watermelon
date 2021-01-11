import { useRouter } from "next/router";
import { useEffect } from "react";

const FirstAuth = ({}) => {
  let router = useRouter();
  let code = router.query.code;
  useEffect(() => {
    fetch(
      `https://slack.com/api/oauth.v2.access?client_id=${process.env.SLACK_CLIENT_ID}&client_secret=${process.env.SLACK_CLIENT_SECRET}&code=${code}`
    )
      .then((response) => response.json())
      .then((data) => console.log(data));
  });
  return (
    <div>
      <h1>Redirecting you</h1>
      <p>Hang on a second</p>
    </div>
  );
};
export default FirstAuth;
