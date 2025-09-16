// Node Modules Import
import cors, { CorsOptions } from "cors";
import express, { NextFunction, Request, Response } from "express";
import config from "./config";
import { logger } from "./lib/winston";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import limiter from "./lib/rate_limit";

// Route Imports
import v1Routes from "@/routes/v1";
import { ApiError } from "./helpers/ApiError";
import { InternalServerError } from "./helpers/CustomError";

const app = express();

// Configure CORS Options
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === "development" ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      // Reject the request from not whitelisted origins
      callback(
        new Error(`CORS Error: ${origin} is not allowed by CORS`),
        false
      );
      logger.warn(`CORS Error: ${origin} is not allowed by CORS`);
    }
  },
};

// Apply CORS middleware
app.use(cors(corsOptions)); // Replace it with app.use(cors()); it you want your backend to access from everywhere

// Enable JSON request body parsing
app.use(express.json());

// Enable URL-encoded request body parsing with extended mode
// 'extended: true' allows rich objects and arrays vis querystring library
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Enable response compression to reduce payload size and improve performance
app.use(
  compression({
    threshold: 1024, // only compress response if size is greater than 1kb
  })
);

// use helmet to enhance security by setting various HTTP headers
app.use(helmet());

// Apply rate limiting middleware to prevent excessive requests and enhance security
app.use(limiter);

app.use("/api/v1", v1Routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
  }

  if (config.NODE_ENV === "development") {
    res.status(500).send({
      message: err.message,
      stack: err.stack,
    });
  }
  ApiError.handle(new InternalServerError(), res);
});

export default app;
