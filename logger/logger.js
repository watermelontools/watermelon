import pino from "pino";
import { logflarePinoVercel } from "pino-logflare";

let logger = {};
// create pino-logflare console stream for serverless functions and send function for browser logs
if (process.env.LOGFLARE_API_KEY) {
  const { stream, send } = logflarePinoVercel({
    apiKey: process.env.LOGFLARE_API_KEY,
    sourceToken: "d2681dae-244d-495c-a0d1-2fc3e4c88dba",
  });

  // create pino loggger
  const logger = pino(
    {
      browser: {
        transmit: {
          send: send,
        },
      },
      level: "debug",
      base: {
        processes_str: JSON.stringify(process.versions),
        revision: process.env.VERCEL_GITHUB_COMMIT_SHA,
      },
    },
    stream
  );
}

export default logger;
