import { Router } from "express";

// Routes Import
import authRoute from "@/routes/v1/auth.route";
import swagger from "./swagger";
const router = Router();

// Health Check Route
router.get("/", (req, res) => {
  res.status(200).json({
    message: "API is live",
    status: "ok",
    version: "1.0.0",
    // docs: "your api docs url if available",
    timeStamp: new Date().toISOString(),
  });
});

// V1 Routes

router.use("/auth", authRoute);
router.use("/docs", swagger);
export default router;
