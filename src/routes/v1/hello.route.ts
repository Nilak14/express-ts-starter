import { sayHello } from "@/controller/v1/hello.controller";
import { Router } from "express";

const router = Router();

router.get("/", sayHello);

export default router;
