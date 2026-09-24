//main root file

import { env } from "node:process";
import { createApp } from "./app";
import { logger } from "./lib/logger";

const app = createApp();

app.listen(env.port, () => {
  logger.info(`Server is now running on port http://localhost:${env.port}`);
});
