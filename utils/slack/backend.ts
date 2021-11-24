import { createThread } from "../airtable/backend";

const axios = require("axios").default;
export const postMessage = async ({ data, token }) => {
  let postURL = `https://slack.com/api/chat.postMessage?channel=${data.channel}`;
  return fetch(postURL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((resjson) => {
      return { status: "ok", resjson };
    })
    .catch((err) => {
      return { status: "error", err };
    });
};
export const createGroup = async ({ data, token }) => {
  let postURL = `https://slack.com/api/conversations.create`;
  return fetch(postURL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((resjson) => {
      return resjson;
    })
    .catch((err) => {
      return { status: "error", err };
    });
};
export const postEphemeral = (ephemeralData, botToken) => {
  axios
    .post("https://slack.com/api/chat.postEphemeral", ephemeralData, {
      headers: {
        Authorization: `Bearer ${botToken}`,
      },
    })
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const sendIcebreaker = ({ icebreakerData, accessToken }) => {
  return fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    ...icebreakerData,
  })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const inviteToRoom = ({ accessToken, watermelonRoomData }) => {
  return fetch(
    `https://slack.com/api/conversations.invite
  ?channel=${watermelonRoomData.channel}
  &users=${watermelonRoomData.users}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      ...watermelonRoomData,
    }
  );
};
export const inviteToOfficeChat = async ({
  accessToken,
  users,
  icebreakerData,
}) => {
  let originalMsg = await fetch(
    `https://slack.com/api/chat.postMessage?channel=${accessToken.channel}&text=${icebreakerData.text}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken.accessToken}`,
      },
    }
  );
  const msgJson = await originalMsg.json();
  await createThread({ messageId: msgJson.ts, channel: accessToken.channel, workspaceRecordId: accessToken.workspaceId, questionRecordId: icebreakerData.questionId, answerRecordId: icebreakerData.answerId })
  const taggedUsers = users.map((user) => {
    return {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `<@${user}>`,
      },
    };
  });
  const blocksToSend = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `${icebreakerData.icebreaker.replace(
          "${answer}",
          icebreakerData.answer
        )}`,
      },
    },
    ...taggedUsers,
  ];
  await fetch(
    `https://slack.com/api/chat.postMessage?channel=${accessToken.channel
    }&blocks=${JSON.stringify(blocksToSend)}&thread_ts=${msgJson.ts}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken.accessToken}`,
      },
    }
  );
};
export const listRoomMembers = async ({ accessToken, channel }) => {
  return (
    await axios.get(
      `https://slack.com/api/conversations.members?channel=${channel}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
  ).data;
};
export const kickFromRoom = async ({ accessToken, channel, user }) => {
  return fetch(
    `https://slack.com/api/conversations.kick?channel=${channel}&user=${user}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};
export const sendDM = async ({ accessToken, channel, text }) => {
  return fetch(
    `https://slack.com/api/chat.postMessage?channel=${channel}&text=${text}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};
