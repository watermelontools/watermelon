const executeRequest = async (query) => {
  const queryString = JSON.stringify({ query: query });
  try {
    console.log("process.env.AZURE_WEBAPP_URL", process.env.AZURE_WEBAPP_URL);
    console.log(
      "process.env.AZURE_WEBAPP_TOKEN",
      process.env.AZURE_WEBAPP_TOKEN
    );
    console.log("queryString", queryString);
    let resp = await fetch(process.env.AZURE_WEBAPP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-vercel-azure-auth-token": process.env.AZURE_WEBAPP_TOKEN,
      },
      body: queryString,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        return data;
      })
      .catch((error) => {
        console.error(error);
        return error;
      });
    return resp;
  } catch (error) {
    console.error(error);
    return error;
  }
};
export default executeRequest;
