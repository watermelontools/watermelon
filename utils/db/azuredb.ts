const executeRequest = async (query) => {
  const queryString = JSON.stringify({ query: query });
  console.log(queryString);
  let resp = await fetch("https://watermelonbackend.azurewebsites.net/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: queryString,
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .catch((error) => {
      console.error(error);
      return error;
    });
  console.log(resp);
  return resp;
};
export default executeRequest;
