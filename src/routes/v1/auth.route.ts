import { login } from "@/controller/v1/auth.controller";
import validateRequest, {
  ValidationSource,
} from "@/middleware/validator.middleware";
import { LoginSchema } from "@/zodSchema/authSchema";
import { Router } from "express";

const router = Router();

router.post(
  "/login",
  validateRequest(LoginSchema, ValidationSource.BODY),
  login
);

export default router;
