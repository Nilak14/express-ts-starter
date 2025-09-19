# 🚀 Express + TypeScript + Prisma + PostgreSQL Starter Template

A **production-ready boilerplate** for quickly setting up an **Express.js** application with **TypeScript**, **Prisma ORM**, and **PostgreSQL**.
This template comes pre-configured with essential features like API versioning, rate limiting, logging, database migrations, and much more — helping you focus on building features instead of boilerplate setup.

> **Note:** The main branch contains Express + MongoDB setup. This `prisma-postgres` branch uses Prisma ORM with PostgreSQL for modern type-safe database operations.

 Clone prisma setup 
```bash
git clone -b prisma-postgres https://github.com/Nilak14/express-ts-starter.git
```
Clone mongo setuo
```bash
https://github.com/Nilak14/express-ts-starter.git
```

---

## ✨ Features

* **CORS Origin Whitelisting** – Secure your APIs by allowing only trusted origins.
* **API Versioning** – Build scalable APIs with clear version control (`/api/v1`).
* **Rate Limiting** – Prevent abuse and DDoS attacks using `express-rate-limit`.
* **Logging with Winston** – Structured and production-ready logs (winston configured in `src/lib/winston`).
* **Prettier Integration** – Clean and consistent code formatting.
* **Path Aliases (`@` imports)** – Simplify import paths for better code organization.
* **PostgreSQL with Prisma ORM** – Type-safe database operations with auto-generated client and migrations.
* **Database Migrations** – Version-controlled schema changes with Prisma migrations.
* **Prisma Studio** – Visual database browser for development.
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
│   ├── lib           # Core utilities (winston, prisma, rate limiting)
│   ├── generated     # Auto-generated Prisma client
│   ├── zodSchema     # Schemas for validator 
│   ├── config.ts     # Environment configuration setup
│   └── server.ts     # Application entry point
├── prisma
│   ├── schema.prisma # Database schema definition
│   └── migrations    # Database migration files
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

Create a `.env` file in the **root directory**. Use `.env.sample` as a reference and add your own credentials (PostgreSQL connection string, port, etc.). Common variables used by this template:

```
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
NODE_ENV=development
```
> **Note:** Visit the `.config.ts` file also for more configuration.
### 4. **Setup Database**

Initialize Prisma and run migrations:

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate init

# (Optional) Open Prisma Studio to view your database
npm run db:view
```

### 5. **Run the development server**

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

## 🔁 Auth — Register & Login (Test routes)

Sample auth routes are provided to test Prisma operations, request validation, and error handling:

### Register Endpoint

**Endpoint:**
```
POST /api/v1/auth/register
```

**Required JSON body:**
```json
{
  "email": "user@example.com",
  "password": "yourPassword123",
  "fullName": "John Doe"
}
```

### Login Endpoint

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

### Example — Successful Login Response

```json
HTTP/1.1 201 OK
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "USER"
    }
  }
}
```

### Example — Successful Register Response

```json
HTTP/1.1 201 OK
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid-string",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "USER",
      "createdAt": "2025-09-19T10:30:00.000Z",
      "updatedAt": "2025-09-19T10:30:00.000Z"
    }
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

| Script                | Description                                    |
| --------------------- | ---------------------------------------------- |
| `npm run dev`         | Run the server in development with **Nodemon** |
| `npm run build`       | Build the project for production               |
| `npm start`           | Run the production build                       |
| `npm run db:generate` | Generate Prisma client from schema             |
| `npm run db:migrate`  | Run Prisma migrations (append migration name)  |
| `npm run db:view`     | Open Prisma Studio to view/edit database       |

### Prisma Scripts Explained

- **`db:generate`** - Generates the Prisma client based on your `schema.prisma`. Run this after any schema changes.
- **`db:migrate`** - Creates and applies database migrations. Usage: `npm run db:migrate add_user_table`
- **`db:view`** - Opens Prisma Studio (visual database browser) at `http://localhost:5555`

---

## 🗄️ Database Schema

The current Prisma schema includes a `User` model with the following structure:

```prisma
model User {
  id        String    @id @default(uuid())
  fullName  String
  email     String    @unique
  password  String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?  // Soft delete support
  role      Role      @default(USER)
}

enum Role {
  ADMIN
  USER
}
```

### Key Features:
- **UUID Primary Keys** - Uses UUIDs instead of auto-incrementing integers
- **Soft Deletes** - `deletedAt` field for safe record deletion
- **Role-based Access** - ADMIN/USER roles with enum type safety
- **Timestamps** - Automatic `createdAt` and `updatedAt` tracking
- **Type Safety** - Full TypeScript integration with auto-generated types

---

## 🔎 Logging

* Winston is configured under `src/lib/winston` (imported in your `ApiError` handler as `logger`).
* Logs are written in a structured format and can be extended to write to files or external transports in production.

---

## 📝 Environment Variables

| Variable       | Description                              |
| -------------- | ---------------------------------------- |
| `PORT`         | Port where the app runs                  |
| `DATABASE_URL` | PostgreSQL connection string             |
| `CORS_ORIGIN`  | Allowed CORS origin(s) (comma-separated) |
| `NODE_ENV`     | environment (development/production)     |

### PostgreSQL Connection String Format

```
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
```

Refer to `.env.sample` for details.

---

## ⚠️ Troubleshooting

If you encounter issues:

* Double-check your `.env` file configuration (especially `DATABASE_URL`).
* Ensure PostgreSQL is running and accessible.
* Run `npm run db:generate` after any schema changes.
* Check logs for errors (Winston logger will display them clearly).
* Confirm Zod schemas match the request payload structure.
* If database connection fails, verify PostgreSQL service is running.
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

### Database & ORM
* **Prisma Client** is auto-generated in `src/generated/prisma` and imported from `@/generated/prisma`.
* **Type Safety** - All database operations are fully typed with TypeScript.
* **Migrations** - Database schema changes are version-controlled through Prisma migrations.
* **User Model** includes UUID primary key, soft deletes (`deletedAt`), and role-based access.

### Error Handling & Validation
* The `ApiError` base class and derived errors are used by the global error handler to return consistent errors.
* Use the `asyncHandler` wrapper for all async controllers to automatically forward errors to the global error handler.
* Use `validate(schema)` middleware for request body validation using Zod. When validation fails, throw `new ValidationError(...)` so it is handled consistently.
* The example auth routes (`/register` and `/login`) are provided to test Prisma operations, validation, and error formatting.

### Branch Information
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
