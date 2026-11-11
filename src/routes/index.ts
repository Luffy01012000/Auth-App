import { Router } from "express";
import type { Container } from "../container.js";
import { createHealthRouter } from "../modules/health/health.routes.js";
import { createUserRouter } from "../modules/user/user.routes.js";

export function createApiRouter(container: Container): Router {
  const apiRouter = Router();

  const healthRouter = createHealthRouter(container.healthController);
  const userRouter = createUserRouter(container.userController);

  // Version 1 routes (/api/v1/*)
  const v1Router = Router();
  v1Router.use("/health", healthRouter);
  v1Router.use("/users", userRouter);

  apiRouter.use("/v1", v1Router);

  return apiRouter;
}
