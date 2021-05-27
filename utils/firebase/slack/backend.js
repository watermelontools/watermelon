const axios = require("axios").default;
const postMessage = (data, token) => {
  axios
    .post("https://slack.com/api/chat.postMessage", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response3) => {
      console.log("post Message", response3.data);
    })
    .catch((err) => {
      console.log(err);
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
const createGroup = async ({ answerTitle, token, users, icebreaker }) => {
  const data = {
    name:
      answerTitle
        .toLowerCase()
        .replace(/\s/g, "-")
        .replace(/\?/g, "")
        .replace(/\!/g, "")
        .replace(
          /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
          ""
        ) + Date.now().toString().slice(-3),
    is_private: true,
  };

  let createChannelFetch = await axios.post(
    "https://slack.com/api/conversations.create",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("postfetch");
  if (createChannelFetch.data.error)
    console.error(createChannelFetch.data.error);
  let newChannelId = createChannelFetch.data.channel.id;
  const channelData = {
    channel: newChannelId,
    users: users,
    is_private: true,
  };

  let inviteToChannelFetch = await axios.post(
    "https://slack.com/api/conversations.invite",
    channelData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(inviteToChannelFetch.data);
  const icebreakerData = {
    channel: inviteToChannelFetch.data.channel.id,
    text: icebreaker
      .replace(/\$\{answer}/g, answerTitle)
      .replace(/\$\{person}/g, `<@${users[0]}>`),
  };
  postMessage(icebreakerData, token);
};

module.exports = {
  postMessage,
  postEphemeral,
  createGroup,
};
