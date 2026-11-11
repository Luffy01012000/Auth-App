import { Router } from "express";
import type { Container } from "../container.js";
import { createHealthRouter } from "../modules/health/health.routes.js";
import { createUserRouter } from "../modules/user/user.routes.js";

export function createApiRouter(container: Container): Router {
  const apiRouter = Router();

  // Version 1 routes (/api/v1/*)
  const v1Router = Router();
  v1Router.use("/health", createHealthRouter(container.healthController));
  v1Router.use("/users", createUserRouter(container.userController));

  apiRouter.use("/v1", v1Router);

  return apiRouter;
}
