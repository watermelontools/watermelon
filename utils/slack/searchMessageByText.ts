export default async function handler({
  text,
  user_token,
}: {
  text: string;
  user_token: string;
}) {
  if (!text) {
    return { error: "no text" };
  }
  if (!user_token) {
    return { error: "no user_token" };
  }

  try {
    return await fetch(`https://slack.com/api/search.messages?query=${text}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Accept-Encoding": "deflate",
        Accept: "application/json",
        Authorization: `Bearer ${user_token}`,
      },
    }).then((res) => res.json());
  } catch (error) {
    console.error(error);
    return error;
  }
}
