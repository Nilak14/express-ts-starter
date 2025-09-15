import { Router } from "express";

// Routes Import
import helloRoute from "@/routes/v1/hello.route";

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

// Routes
router.use("/hello", helloRoute);
export default router;
