import updateTokensFromConfluence from "../../utils/confluence/updateTokens";
import updateTokens from "../../utils/db/confluence/updateTokens";

type ConfluenceResult = { error: string } | any[];
function removeSpecialChars(inputString) {
  const specialChars = '!"#$%&/()=-_"{}¨*[]'; // Edit this list to include or exclude characters
  return inputString
    .split("")
    .filter((char) => !specialChars.includes(char))
    .join("");
}
async function getConfluence({
  confluence_token,
  confluence_refresh_token,
  confluence_id,
  user,
  randomWords,
  amount = 3,
}) {
  if (!confluence_token || !confluence_refresh_token) {
    return { error: "no confluence token" };
  } else {
    if (!user) {
      return { error: "no user" };
    }
    if (!confluence_id) {
      return { error: "no confluence cloudId" };
    }
    const newAccessTokens = await updateTokensFromConfluence({
      refresh_token: confluence_refresh_token,
    });
    await updateTokens({
      access_token: newAccessTokens.access_token,
      refresh_token: newAccessTokens.refresh_token,
      user,
    });
    let cleanRW = Array.from(
      new Set(randomWords.map((word) => removeSpecialChars(word)))
    );
    const titleQuery = cleanRW.map((word) => `title ~ "${word}"`).join(" OR ");
    const textQuery = cleanRW.map((word) => `text ~ "${word}"`).join(" OR ");
    // Sorting by description might be better than completely filtering out tickets without a description
    let cql = `(${titleQuery}) OR (${textQuery}) ORDER BY created DESC`;
    const reqUrl = `https://api.atlassian.com/ex/confluence/${confluence_id}/rest/api/search?cql=${cql}&limit=${amount}`;
    let returnVal = await fetch(reqUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${newAccessTokens.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((resJson) => {
        console.log("resJson", resJson);
        return resJson.results;
      })
      .catch((error) => {
        console.error(error);
      });
    return returnVal;
  }
}
export default getConfluence;
