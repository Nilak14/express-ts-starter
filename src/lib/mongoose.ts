import config from "@/config";
import mongoose, { ConnectOptions } from "mongoose";
import { logger } from "./winston";

const clientOption: ConnectOptions = {
  dbName: "blog-db",
  appName: "Blog API",
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

export const connectToDatabase = async (): Promise<void> => {
  if (!config.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in the configuration");
  }
  try {
    await mongoose.connect(config.MONGO_URI, clientOption);
    logger.info("Connected to the database successfully", {
      uri: config.MONGO_URI,
      options: clientOption,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    logger.error("Error connecting to the database", error);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info("Disconnected from the database successfully", {
      uri: config.MONGO_URI,
      options: clientOption,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    logger.error("Error disconnecting from the database", error);
  }
};
