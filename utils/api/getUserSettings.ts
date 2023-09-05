const getUserSettings = async (email: string) => {
  const { data } = await fetch("/api/user/settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));
  return data;
};
export default getUserSettings;
