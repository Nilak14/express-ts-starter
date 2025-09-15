// Node Modules Import
import cors, { CorsOptions } from "cors";
import express from "express";
import config from "./config";
import { logger } from "./lib/winston";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import limiter from "./lib/rate_limit";
import { connectToDatabase, disconnectFromDatabase } from "./lib/mongoose";

// Route Imports
import v1Routes from "@/routes/v1";

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

(async () => {
  try {
    await connectToDatabase();
    app.use("/api/v1", v1Routes);
    app.listen(config.PORT, () => {
      logger.info(`Server  running: http://localhost:${config.PORT}`);
    });
  } catch (error) {
    logger.error("Failed To start the server", error);

    if (config.NODE_ENV === "production") {
      process.exit(1); // Exit the process with a non-zero code to indicate failure
    }
  }
})();

/** *
 * Handles server shutdown gracefully by disconnecting from the database.
 * - Attempts to disconnect from the database before shutting down the server.
 * - Logs a success message if the disconnection is successful.
 * - If an error occurs during disconnection, it is logged to the console.
 * - Exists the process with status code 0 (indicating a successful shutdown)
 * */

const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
    logger.warn("Server SHUTDOWN");
    process.exit(0);
  } catch (error) {
    logger.error("Error during server shutdown", error);
  }
};

/**
 * Listens for termination signals ("SIGTREM" and "SIGINT").
 *
 * - "SIGTREM"  is typically sent when stopping a process (e.g. 'kill' command or container shutdown)
 * - "SIGINT"  triggered when the yser interrupts the process (e.g. Ctrl+C)
 * - When either signal is received, 'handleServerShutdown' is executed to ensure proper cleanup
 *
 */

process.on("SIGTERM", handleServerShutdown);
process.on("SIGINT", handleServerShutdown);
