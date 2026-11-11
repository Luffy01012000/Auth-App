import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { createUserSchema, userIdParamSchema } from "./dto/user.dto.js";
import type { UserController } from "./user.controller.js";

export function createUserRouter(controller: UserController): Router {
  const router = Router();

  router.post("/", validate({ body: createUserSchema }), controller.create);
  router.get("/", controller.getAll);
  router.get("/:id", validate({ params: userIdParamSchema }), controller.getById);

  return router;
}
