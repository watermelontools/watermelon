import { AtlassianAPIInput, StandardAPIResponse } from "../../types/watermelon";
import getFreshConfluenceTokens from "../confluence/getFreshConfluenceTokens";

function removeSpecialChars(inputString) {
  const specialChars = '!"#$%&/()=-_"{}¨*[]'; // Edit this list to include or exclude characters
  return inputString
    .split("")
    .filter((char) => !specialChars.includes(char))
    .join("");
}

async function fetchFromConfluence(cql, amount, accessToken, confluence_id) {
  const reqUrl = `https://api.atlassian.com/ex/confluence/${confluence_id}/rest/api/search?cql=${cql}&limit=${amount}`;
  return fetch(reqUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => res.json())
    .then((resJson) => resJson.results)
    .catch((error) => {
      console.error("Error in fetchFromConfluence:", error);
      return { error: "Failed to fetch data from Confluence." };
    });
}

async function getConfluence({
  token,
  refresh_token,
  cloudId,
  user,
  randomWords,
  amount = 3,
}: AtlassianAPIInput): Promise<StandardAPIResponse> {
  // Error handling
  if (!token || !refresh_token) return { error: "no confluence token" };
  if (!user) return { error: "no user" };
  if (!cloudId) return { error: "no confluence cloudId" };

  // Refresh tokens
  const newAccessTokens = await getFreshConfluenceTokens({
    refresh_token,
    user,
  });
  if (!newAccessTokens.access_token) return { error: "no confluence token" };
  // Constructing search query
  const cleanRandomWords = Array.from(
    new Set(randomWords?.map((word) => removeSpecialChars(word)))
  );
  const titleQuery = cleanRandomWords
    .map((word) => `title ~ "${word}"`)
    .join(" OR ");
  const textQuery = cleanRandomWords
    .map((word) => `text ~ "${word}"`)
    .join(" OR ");
  const cql = `(${titleQuery}) OR (${textQuery}) ORDER BY created DESC`;

  // Fetch data from Confluence
  try {
    const results = await fetchFromConfluence(
      cql,
      amount,
      newAccessTokens.access_token,
      cloudId
    );
    return {
      fullData: results,
      data: results?.map((result) => ({
        number: result.id,
        title: result.title,
        link: result._links.webui,
        body: result.excerpt,
      })),
    };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch data from Confluence." };
  }
}

export default getConfluence;
