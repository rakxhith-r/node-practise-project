import pino from "pino";
import { env } from "../config/env.js";

const isDevelopment = env.nodeEnv === "development";

export const logger = pino({
  level: env.logLevel,
  ...(isDevelopment && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
      },
    },
  }),
});
