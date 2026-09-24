//Entry file for express
import express from "express";
import cors from "cors";
import { ErrorHandler } from "./middlewares/errorHandler";
import { NotFound } from "./middlewares/notFound";
import { apiRouter } from "./routes";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", apiRouter);

  app.use(ErrorHandler);
  app.use(NotFound);

  return app;
}
