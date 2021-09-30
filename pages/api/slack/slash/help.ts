import logger from "../../../../logger/logger";

export default async function handler(req, res) {

        console.log(req.body)
    res.status(200).json({ status: "ok" });
}
