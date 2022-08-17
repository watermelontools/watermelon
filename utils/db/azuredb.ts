const executeRequest = async (query) => {
  const queryString = JSON.stringify({ query: query });
  let resp = await fetch("https://watermelonbackend.azurewebsites.net/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: queryString,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
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
