const getSlackInfo = async (userEmail: string) => {
  const data = await fetch("/api/slack/getUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: userEmail,
    }),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  return data;
};
export default getSlackInfo;
