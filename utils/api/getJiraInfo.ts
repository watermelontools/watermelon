const getJiraInfo = async (userEmail: string) => {
  const data = await fetch("/api/jira/getUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: userEmail,
    }),
  }).then((res) => res.json());
  return data;
};
export default getJiraInfo;
