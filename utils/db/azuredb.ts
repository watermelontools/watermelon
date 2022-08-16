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
      console.log(response.status);
      // print the response body to the console
      let resp = response.json();
      console.log(resp);
      return resp;
    })
    .catch((error) => {
      console.error(error);
      return error;
    });
  return resp;
};
export default executeRequest;
