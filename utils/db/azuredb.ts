const executeRequest = async (query) => {
  const queryString = JSON.stringify({ query: query });
  try {
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
        return data;
      })
      .catch((error) => {
        console.error(error);
        return error;
      });
    // console.log("resp", resp);
    return resp;
  } catch (error) {
    console.error(error);
    return error;
  }
};
export default executeRequest;
