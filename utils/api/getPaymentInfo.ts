const getPaymentInfo = async (userEmail: string) => {
  const data = await fetch("/api/payments/getByEmail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: userEmail,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.email) {
        return true;
      }
    });
  return data;
};
export default getPaymentInfo;
