const executeRequest = async (query) => {
  const queryString = JSON.stringify({ query: query });
  console.log(queryString);
  let resp = await fetch("https://watermelonbackend.azurewebsites.net/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: queryString,
  }).then((response) => response.json());
  console.log(resp);
  return resp;
};
export default executeRequest;
