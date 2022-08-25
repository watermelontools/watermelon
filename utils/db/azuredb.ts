const executeRequest = async (query) => {
  const queryString = JSON.stringify({ query: query });
  let resp = await fetch(process.env.AZURE_WEBAPP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: queryString,
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
      return error;
    });
  console.log("resp", resp);
  return resp;
};
export default executeRequest;
