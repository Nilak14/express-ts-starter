import app from "./app";
import config from "./config";

import { logger } from "./lib/winston";

(async () => {
  try {
    // await connectToDatabase();

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
    // await disconnectFromDatabase();
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
