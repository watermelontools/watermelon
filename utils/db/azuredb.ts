const executeRequest = async (query: string) => {
  const queryString = JSON.stringify({ query: query });

  try {
    const response = await fetch(process.env.AZURE_WEBAPP_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-vercel-azure-auth-token": process.env.AZURE_WEBAPP_TOKEN!,
      },
      body: queryString,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error with the database request:", errorText);
      throw new Error(
        `Failed to execute SQL query. HTTP Status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in executeRequest:", error);
    throw error; // Re-throw the error for the calling function to handle
  }
};

export default executeRequest;
