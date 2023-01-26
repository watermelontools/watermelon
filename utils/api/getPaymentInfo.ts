const getPaymentInfo = async (email: string) => {
  const data = await fetch("/api/payments/getByEmail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.email) {
        return true;
      } else {
        return false;
      }
    });
  return data;
};
export default getPaymentInfo;
