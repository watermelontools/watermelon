import logger from "../../../logger/logger";

export default function handler(req, res) {
  logger.error("loggertest");

  console.error("no team id");
  res.status(400).json({ status: "error", error: "no team id" });
}
