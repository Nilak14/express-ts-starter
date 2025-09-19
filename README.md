# 🚀 Express + TypeScript + Mongoose Starter Template

A **production-ready boilerplate** for quickly setting up an **Express.js** application with **TypeScript** and **MongoDB (Mongoose)**.
This template comes pre-configured with essential features like API versioning, rate limiting, logging, and much more — helping you focus on building features instead of boilerplate setup.

> **Note:** The main branch contains Express + MongoDB setup. This `prisma-postgres` branch uses Prisma ORM with PostgreSQL for modern type-safe database operations.

Clone mongo setup
```bash
https://github.com/Nilak14/express-ts-starter.git
```

 Clone prisma setup 
```bash
git clone -b prisma-postgres https://github.com/Nilak14/express-ts-starter.git
```

---

## ✨ Features

* **CORS Origin Whitelisting** – Secure your APIs by allowing only trusted origins.
* **API Versioning** – Build scalable APIs with clear version control (`/api/v1`).
* **Rate Limiting** – Prevent abuse and DDoS attacks using `express-rate-limit`.
* **Logging with Winston** – Structured and production-ready logs (winston configured in `src/lib/winston`).
* **Prettier Integration** – Clean and consistent code formatting.
* **Path Aliases (`@` imports)** – Simplify import paths for better code organization.
* **MongoDB with Mongoose** – Built-in database setup for quick development.
* **Apache License 2.0** – Open-source friendly.
* **Nodemon** – Auto-restart development server for faster development.
* **Custom ApiError Handler** – Centralized, typed API errors and consistent error responses.
* **Async handler** – `asyncHandler` to avoid repetitive `try/catch` blocks in controllers.
* **Zod Validation Middleware** – Request validation using Zod schemas and consistent validation errors.
* **Swagger API Documentation** – Auto-generated interactive API docs with JWT authentication support.

---

## 📂 Project Structure

```
├── src
│   ├── controllers   # API controllers (business logic) with Swagger JSDoc
│   ├── middlewares   # Custom middlewares for Express
│   ├── helpers       # Helper Functions
│   ├── routes        # API route definitions + Swagger setup
│   ├── lib           # Core utilities and reusable modules 
│   ├── zodSchema     # Schemas for validator 
│   ├── config.ts     # Environment configuration setup
│   └── server.ts     # Application entry point
├── .env.sample       # Sample environment variables
├── package.json
├── .prettierrc       # Prettier configuration
└── tsconfig.json     # TypeScript configuration
```

---

## ⚡ Quick Start

Follow these steps to set up and run the project:

### 1. **Clone the repository**

```bash
git clone https://github.com/Nilak14/express-ts-starter.git
cd express-ts-starter
```

### 2. **Install dependencies**

```bash
npm install
```

### 3. **Setup environment variables**

Create a `.env` file in the **root directory**. Use `.env.sample` as a reference and add your own credentials (MongoDB URI, port, etc.). Common variables used by this template:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/dbname
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### 4. **Run the development server**

```bash
npm run dev
```

---

## 🧪 Verify Setup

Once the server is running, check the following endpoints to confirm everything is working.

### **Health Check Endpoint**

**URL:**

```
http://localhost:<PORT>/api/v1
```

**Response:**

```json
{
  "message": "API is live",
  "status": "ok",
  "version": "1.0.0",
  "timeStamp": "Current time stamp"
}
```

### **Swagger API Documentation**

Interactive API documentation is available at:

**URL:**

```
http://localhost:<PORT>/api/v1/docs
```

The Swagger UI provides:
- **Interactive API testing** – Test endpoints directly from the browser
- **JWT Authentication** – Authorize requests using Bearer tokens
- **Auto-generated schemas** – Request/response models from JSDoc comments
- **Complete API reference** – All endpoints with detailed descriptions

---

## 🔁 Auth — Login (Test route)

A sample POST route is provided to test request validation and error handling:

**Endpoint:**

```
POST /api/v1/auth/login
```

**Required JSON body:**

```json
{
  "email": "user@example.com",
  "password": "yourPassword123"
}
```

### Example — Successful Response

```json
HTTP/1.1 201 OK
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
      "user": {
          "email":"user@example.com",
         
    },
  }
}
```

### Example — Validation Error (bad request body)

If you send an invalid body (e.g. missing `password` or wrong email format) the Zod validation middleware will throw a `ValidationError` handled by the central error handler. Example response:

```json
HTTP/1.1 400 Bad Request
{
  "success": false,
  "type": "ValidationError",
  "message": "password is required"
}
```

### Example — Unauthorized (invalid credentials)

```json
HTTP/1.1 401 Unauthorized
{
  "success": false,
  "type": "Unauthorized",
  "message": "Invalid credentials"
}
```

---

## 🧩 Error Handling (ApiError)

This template centralizes errors with a typed `ApiError` base class and several derived errors (`BadRequestError`, `NotFoundError`, `UnauthorizedError`, etc.).

**Behavior:**

* Controllers or middlewares can `throw new ValidationError('message')` or any other `ApiError`.
* The global error handler calls `ApiError.handle(err, res)` which logs the error with Winston and returns a consistent JSON payload.

**Response shape from `ApiError.handle(...)`:**

```json
{
  "success": false,
  "type": "<ErrorType>",
  "message": "<error message>"
}
```

This matches the classes you added (see `src/helpers/ApiError.ts` and derived classes).

---

## 🧠 Async Handler & Validation Middleware (snippets)

### `asyncHandler` (avoid repeating `try/catch`)

```ts
// src/helpers/asyncHandler.ts
import { NextFunction, Request, Response } from "express";

type AsyncHandler<T extends Request> = (
  req: T,
  res: Response,
  next: NextFunction
) => Promise<void>;

export default function asyncHandler<T extends Request>(
  execution: AsyncHandler<T>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    execution(req as T, res, next).catch(next);
  };
}

```

Usage in a route:

```ts
import asyncHandler from "@/helpers/asyncHandler";
import { NextFunction, Request, Response } from "express";
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Your Logic
  })
```

### `zod` validation middleware (example)

```ts
// src/middlewares/validate.ts
import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { ValidationError } from "../helpers/CustomError";

export enum ValidationSource {
  BODY = "body",
  QUERY = "query",
  HEADER = "header",
  PARAMS = "params",
}

const validateRequest = (
  schema: z.ZodSchema,
  source: ValidationSource = ValidationSource.BODY
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req[source]);
      Object.assign(req[source], data);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
       // you can format result.error to a friendly message/list
        const messages = err.issues.map((issue) => issue.message).join(", ");
        return next(new ValidationError(messages));
      } else {
        next(err);
      }
    }
  };
};

export default validateRequest;

```

---

## 🔧 Scripts

| Script          | Description                                    |
| --------------- | ---------------------------------------------- |
| `npm run dev`   | Run the server in development with **Nodemon** |
| `npm run build` | Build the project for production               |
| `npm start`     | Run the production build                       |

---

## 🔎 Logging

* Winston is configured under `src/lib/winston` (imported in your `ApiError` handler as `logger`).
* Logs are written in a structured format and can be extended to write to files or external transports in production.

---

## 📝 Environment Variables

| Variable      | Description                              |
| ------------- | ---------------------------------------- |
| `PORT`        | Port where the app runs                  |
| `MONGO_URI`   | MongoDB connection string                |
| `CORS_ORIGIN` | Allowed CORS origin(s) (comma-separated) |
| `NODE_ENV`    | environment (development/production)     |

Refer to `.env.sample` for details.

---

## ⚠️ Troubleshooting

If you encounter issues:

* Double-check your `.env` file configuration.
* Ensure MongoDB is running and accessible.
* Check logs for errors (Winston logger will display them clearly).
* Confirm Zod schemas match the request payload structure.
* If the issue persists, **contact the developer**.

---

## 🛡️ License

This project is licensed under the **Apache License 2.0** – free to use and modify.

---

## 🤝 Contributing

Contributions are welcome! Feel free to **fork** this repository, create a feature branch, and submit a pull request. Please keep code style consistent (Prettier + TypeScript rules).

---

## 👨‍💻 Contact

If you face any issues or have suggestions, reach out to the developer:

**GitHub:** [Nilak14](https://github.com/Nilak14)

---

## 🗒️ Notes / Implementation details

* The `ApiError` base class and derived errors you shared are used by the global error handler to return consistent errors. Keep the `ApiError.handle(err, res)` call inside your global `errorHandler` middleware.
* Use the `asyncHandler` wrapper for all async controllers to automatically forward errors to the global error handler.
* Use `validate(schema)` middleware for request body validation using Zod. When validation fails, throw `new ValidationError(...)` so it is handled consistently.
* The example `POST /api/v1/auth/login` route is provided to test validation and error formatting. Send a malformed request (e.g. missing `password`) to confirm validation errors are returned in the `ApiError` format.
* ### Branch Information
* **Main Branch**: Contains Express + MongoDB (Mongoose) setup
* **Current Branch** (`prisma-postgres`): Uses Prisma ORM with PostgreSQL for modern, type-safe database operations

### 📚 Swagger Documentation

* **Auto-generated docs** – Swagger scans JSDoc comments in `./src/controller/v1/*.controller.ts` files to generate API documentation.
* **JWT Authentication** – Swagger UI includes Bearer token authentication for testing protected endpoints.
* **Schema definitions** – Define request/response schemas using JSDoc `@swagger` comments in your controllers.
* **Interactive testing** – Test your APIs directly from the Swagger UI at `/api/v1/docs`.

**Example JSDoc for Swagger:**
```ts
/**
 * @swagger
 * /api/v1/auth/login:
 *  post:
 *    tags:
 *      - Auth
 *    summary: Login a User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Login'
 *    responses:
 *      201:
 *        description: User logged in successfully
 */
```
