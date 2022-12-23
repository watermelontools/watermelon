export default async function handler({
  channelId,
  text,
  user_token,
  threadTS,
  broadcast,
}: {
  channelId: string;
  text: string;
  user_token: string;
  threadTS: string;
  broadcast?: boolean;
}) {
  if (!channelId) {
    return { error: "no channelId" };
  }
  if (!text) {
    return { error: "no text" };
  }
  if (!user_token) {
    return { error: "no user_token" };
  }
  if (!threadTS) {
    return { error: "no threadTS" };
  }
  try {
    return await fetch(`https://slack.com/api/chat.postMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Accept-Encoding": "deflate",
        Accept: "application/json",
        Authorization: `Bearer ${user_token}`,
      },
      body: JSON.stringify({
        channel: channelId,
        text: text,
        thread_ts: threadTS,
        reply_broadcast: broadcast,
      }),
    }).then((res) => res.json());
  } catch (error) {
    console.error(error);
    return error;
  }
}
