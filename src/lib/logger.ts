import pino from "pino";
import { env } from "../config/env";

export const logger = pino({
  level: env.logLevel ?? "info",
  transport: !env.isProduction
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          tanslateTime: "SYS:standard",
        },
      }
    : undefined,
});
