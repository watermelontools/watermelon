const axios = require("axios");

const response = axios
  .get(
    "https://watermelontools.atlassian.net/rest/api/2/search?jql=assignee=6205b6df506317006b092e68",
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          "evargas@watermelon.tools:Ws4UXtbhS2WZ0dnaBYGf9963"
        ).toString("base64")}`,
      },
    }
  )
  .then((res) => {
    res.send(res.data.issues);
  })
  .catch((err) => console.error(err.response.data));
