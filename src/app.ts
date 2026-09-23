//Entry file for express
import express from "express";
import { ErrorHandler } from "./middlewares/errorHandler";
import { NotFound } from "./middlewares/notFound";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(ErrorHandler);
  app.use(NotFound);
}
