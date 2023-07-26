import { StandardAPIResponse } from "../../types/watermelon";

function removeSpecialChars(inputString) {
  const specialChars = '!"#$%&/()=-_"{}¨*[]'; // Edit this list to include or exclude characters
  return inputString
    .split("")
    .filter((char) => !specialChars.includes(char))
    .join("");
}

async function getNotion({
  notion_token,
  randomWords,
  amount = 3,
}): Promise<StandardAPIResponse> {
  if (!notion_token) {
    return { error: "no notion token" };
  } else {
    let cleanRW = Array.from(
      new Set(randomWords.map((word) => removeSpecialChars(word)))
    );

    let returnVal = await fetch(`https://api.notion.com/v1/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${notion_token}`,
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        query: cleanRW.join(" "),
        page_size: amount,
      }),
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error("notion error", error);
      });

    return {
      fullData: returnVal,
      data: returnVal?.results?.map((result) => {
        return {
          title: result?.properties?.title?.title[0]?.plain_text,
          body: result?.properties?.excerpt?.rich_text[0]?.plain_text,
          link: result.url,
          image:
            result.icon?.type === "external"
              ? `<img src="${result?.icon?.external.url}" alt="Page icon" width="20" height="20" />`
              : result?.icon?.type === "emoji"
              ? `<img src="${result?.icon?.emoji}" alt="Page icon" width="20" height="20" />`
              : "",
        };
      }),
    };
  }
}
export default getNotion;
