import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV!,
  WHITELIST_ORIGINS: ["your frontend url"],
  MONGO_URI: process.env.MONGO_URI!,
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  PROD_URL: process.env.PROD_URL!,
  APP_NAME: process.env.APP_NAME!,
};

export default config;
