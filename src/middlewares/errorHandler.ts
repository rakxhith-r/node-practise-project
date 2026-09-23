import { NextFunction, Request, Response } from "express";
import { logger } from "../lib/logger";

export function ErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  logger.error({ err }, "Unhandled Error");

  res.status(500).json({
    success: false,
    message: "Intrenal Server Error",
  });
}
