const getUserSettings = async (userEmail: string) => {
  const data = await fetch("/api/user/settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: userEmail,
    }),
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));
  return data;
};
export default getUserSettings;
