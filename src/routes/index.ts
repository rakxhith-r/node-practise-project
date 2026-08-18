//This file is to combine all the routes of application.

import { Router } from "express";
import { healthRouter } from "./health.routes.js";

export const apiRouter = Router();

//Plugging all routes in one place
apiRouter.use(healthRouter);
