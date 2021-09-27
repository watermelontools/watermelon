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
  axios
    .post("https://slack.com/api/chat.postMessage", icebreakerData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const inviteToRoom = ({ accessToken, watermelonRoomData }) => {
  axios
    .post("https://slack.com/api/conversations.invite", watermelonRoomData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const listRoomMembers = async ({ accessToken, channel }) => {
  return (await axios
    .get(`https://slack.com/api/conversations.members?channel=${channel}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })).data
};
export const kickFromRoom = async ({ accessToken, channel, user }) => {
  return (await axios
    .post(`https://slack.com/api/conversations.members?channel=${channel}&user=${user}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }))
};
export const sendDM = async ({ accessToken, channel, text }) => {
  return (await axios
    .post(`https://slack.com/api/chat.postMessage?channel=${channel}&text=${text}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }))
};