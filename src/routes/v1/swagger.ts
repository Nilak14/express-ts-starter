import { Router } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import config from "../../config";
import swaggerUi from "swagger-ui-express";
const router = Router();

const options: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: (config.APP_NAME || "API Documentation") + " (v1)",
      version: "1.0.0",
      description: (config.APP_NAME || "API") + " Documentation (v1)",
    },
    tags: [
      {
        name: "Auth",
        description: "Auth related endpoints",
      },
    ],
    servers: [
      {
        url: `http://localhost:${config.PORT}`,
        description: "Local Server",
      },
      {
        url: config.PROD_URL,
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        Bearer: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Authorization header using the Bearer scheme",
        },
      },
    },
  },
  apis: ["./src/controller/v1/*.controller.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

require("swagger-model-validator")(swaggerSpec);

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
