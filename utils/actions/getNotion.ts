function removeSpecialChars(inputString) {
  const specialChars = '!"#$%&/()=-_"{}¨*[]'; // Edit this list to include or exclude characters
  return inputString
    .split("")
    .filter((char) => !specialChars.includes(char))
    .join("");
}

async function getNotion({ notion_token, randomWords, amount = 3 }) {
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
      },
      body: JSON.stringify({
        query: cleanRW.join(" "),
      }),
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error("notion error", error);
      });

    console.log(returnVal);
    return returnVal?.slice(0, amount);
  }
}
export default getNotion;
