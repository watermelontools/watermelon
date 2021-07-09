const axios = require("axios").default;
const postMessage = async ({ data, token }) => {
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
      return { status: "error" }, err;
    });
};
const createGroup = async ({ data, token }) => {
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
      return resjson.channel.id;
    })
    .catch((err) => {
      return { status: "error" }, err;
    });
};
const postEphemeral = (ephemeralData, botToken) => {
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

module.exports = {
  postMessage,
  postEphemeral,
  createGroup,
};
