import pino from "pino";
import { logflarePinoVercel } from "pino-logflare";

// create pino-logflare console stream for serverless functions and send function for browser logs
const { stream, send } = logflarePinoVercel({
  apiKey: "GzedT0NDpXjZ",
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

export default logger;
