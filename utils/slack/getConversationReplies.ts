export default async function handler({
  channelId,
  ts,
  user_token,
}: {
  channelId: string;
  ts: string;
  user_token: string;
}) {
  if (!channelId) {
    return { error: "no channelId" };
  }
  if (!ts) {
    return { error: "no ts" };
  }
  if (!user_token) {
    return { error: "no user_token" };
  }
  try {
    const replies = await fetch(`https://slack.com/api/conversations.replies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "deflate",
        Accept: "application/json",
        Authorization: `Bearer ${user_token}`,
      },
      body: `channel=${channelId}&ts=${ts}&include_all_metadata=true`,
    }).then((res) => res.json());
    const promises = replies.messages.map(async (element, index) => {
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
          replies.messages[index].userInfo = json;
        });
    });
    await Promise.allSettled(promises);
    return replies;
  } catch (error) {
    console.error(error);
    return error;
  }
}
