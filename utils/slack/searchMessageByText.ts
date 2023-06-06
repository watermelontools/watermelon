export default async function handler({
  text,
  user_token,
  count,
}: {
  text: string;
  user_token: string;
  count?: number;
}) {
  if (!text) {
    return { error: "no text" };
  }
  if (!user_token) {
    return { error: "no user_token" };
  }

  try {
    const foundMessages = await fetch(
      `https://slack.com/api/search.messages?query=${text}${
        count ? `&count=${count}` : ""
      }}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Accept-Encoding": "deflate",
          Accept: "application/json",
          Authorization: `Bearer ${user_token}`,
        },
      }
    ).then((res) => res.json());

    //map to promises the matched messages
    // and fetch the user info for each message
    const promises = foundMessages.messages.matches.map(
      async (element, index) => {
        return await fetch(
          `https://slack.com/api/users.info?user=${element.user}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Accept-Encoding": "deflate",
              Accept: "application/json",
              Authorization: `Bearer ${user_token}`,
            },
          }
        )
          .then((res) => res.json())
          .then((json) => {
            foundMessages.messages.matches[index].userInfo = json;
          });
      }
    );
    await Promise.allSettled(promises);

    return foundMessages;
  } catch (error) {
    console.error(error);
    return error;
  }
}
