const getBitbucketInfo = async (userEmail: string) => {
  console.log(userEmail);
  const data = await fetch("/api/bitbucket/getUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: userEmail,
    }),
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));
  return data;
};
export default getBitbucketInfo;
