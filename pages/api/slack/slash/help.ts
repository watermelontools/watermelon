import logger from "../../../logger/logger";

export default async function handler(req, res) {
    let { payload } = req.body;
    let slackResponse = await JSON.parse(payload);
    console.log(slackResponse)
    logger.info({ message: "NEW_INTERACTION", slackResponse })

    res.status(200).json({ status: "ok" });
}
