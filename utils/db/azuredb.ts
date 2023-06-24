const executeRequest = async (query: string) => {
  const queryString = JSON.stringify({ query: query });
  try {
    console.log("queryString", queryString);
    let resp = await fetch(process.env.AZURE_WEBAPP_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-vercel-azure-auth-token": process.env.AZURE_WEBAPP_TOKEN!,
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
