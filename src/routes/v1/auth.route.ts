import { login, register } from "@/controller/v1/auth.controller";
import validateRequest, {
  ValidationSource,
} from "@/middleware/validator.middleware";
import { LoginSchema, RegisterSchema } from "@/zodSchema/authSchema";
import { Router } from "express";

const router = Router();

router.post(
  "/login",
  validateRequest(LoginSchema, ValidationSource.BODY),
  login
);

router.post(
  "/register",
  validateRequest(RegisterSchema, ValidationSource.BODY),
  register
);

export default router;
