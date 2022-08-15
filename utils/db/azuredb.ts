const executeRequest = async (query) => {
  let resp = await fetch("https://watermelonbackend.azurewebsites.net/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: query }),
  }).then((response) => response.json());
  return resp;
};
export default executeRequest;
