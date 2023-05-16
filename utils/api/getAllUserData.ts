const getAllUserData = async (userEmail: string) => {
  const data = await fetch("/api/user/getAllPublicUserData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userEmail,
    }),
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));
  return data;
};
export default getAllUserData;
