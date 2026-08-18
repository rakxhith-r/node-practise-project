//Entry file for express / Logic related to express

import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { apiRouter } from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(cors());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //Below is the base api endpoint
  app.use("/api", apiRouter);

  app.use(errorHandler);
  app.use(notFound);

  return app;
}
