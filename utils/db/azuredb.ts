const executeRequest = async (query) => {
  const queryString = JSON.stringify({ query: query });
  let resp = await fetch("https://watermelonbackend.azurewebsites.net/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: queryString,
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error(error);
      return error;
    });
  return resp;
};
export default executeRequest;
