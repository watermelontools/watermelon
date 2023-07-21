import getConfluence from "../../../utils/actions/getConfluence";

export default async (req, res) => {
  let {
    confluence_token,
    confluence_refresh_token,
    confluence_id,
    user,
    randomWords,
    amount = 3,
  } = req.body;
  console.log("req.body", req.body);
  await getConfluence({
    confluence_token,
    confluence_refresh_token,
    confluence_id,
    user,
    randomWords: randomWords.split(","),
    amount,
  })
    .then((data) => {
      console.log("data", data);
      return res.status(200).json(data);
    })
    .catch((error) => {
      console.log("error", error);
      res.status(500).json({ error });
    });
};
