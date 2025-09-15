# 🚀 Express + TypeScript + Mongoose Starter Template

A **production-ready boilerplate** for quickly setting up an **Express.js** application with **TypeScript** and **MongoDB (Mongoose)**.
This template comes pre-configured with essential features like API versioning, rate limiting, logging, and much more — helping you focus on building features instead of boilerplate setup.

---

## ✨ Features

* **CORS Origin Whitelisting** – Secure your APIs by allowing only trusted origins.
* **API Versioning** – Build scalable APIs with clear version control (`/api/v1`).
* **Rate Limiting** – Prevent abuse and DDoS attacks using `express-rate-limit`.
* **Logging with Winster** – Structured and production-ready logs.
* **Prettier Integration** – Clean and consistent code formatting.
* **Path Aliases (`@` imports)** – Simplify import paths for better code organization.
* **MongoDB with Mongoose** – Built-in database setup for quick development.
* **Apache License 2.0** – Open-source friendly.
* **Nodemon** – Auto-restart development server for faster development.

---

## 📂 Project Structure

```
├── src
│   ├── controllers   # API controllers
│   ├── middlewares   # Custom middlewares
│   ├── routes        # API route definitions
│   ├── lib           # Core utilities and reusable modules (DB, logger, etc.)
│   ├── config.ts     # env configs
│   └── server.ts     # Entry point
├── .env.sample       # Sample environment variables
├── package.json
├── .prettierrc
└── tsconfig.json
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

Create a `.env` file in the **root directory**.
Use `.env.sample` as a reference and add your own credentials (like MongoDB URI, port, etc.).

### 4. **Run the development server**

```bash
npm run dev
```

---

## 🧪 Verify Setup

Once the server is running, check the following endpoints to confirm everything is working:

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

---

### **Hello Endpoint**

**URL:**

```
http://localhost:<PORT>/api/v1/hello
```

**Response:**

```json
{
  "message": "Hello User",
  "success": true
}
```

> ✅ If you receive the above two responses, your setup is complete!

---

## 🔧 Scripts

| Script          | Description                                    |
| --------------- | ---------------------------------------------- |
| `npm run dev`   | Run the server in development with **Nodemon** |
| `npm run build` | Build the project for production               |
| `npm start`     | Run the production build                       |

---

## 📝 Environment Variables

| Variable      | Description               |
| ------------- | ------------------------- |
| `PORT`        | Port where the app runs   |
| `MONGO_URI`   | MongoDB connection string |
| `CORS_ORIGIN` | Allowed CORS origin(s)    |

Refer to `.env.sample` for details.

---

## 📖 API Versioning

All routes are prefixed with:

```
/api/v1
```

Example:

* Health Route → `/api/v1`
* Hello Route → `/api/v1/hello`

---

## ⚠️ Troubleshooting

If you encounter issues:

* Double-check your `.env` file configuration.
* Ensure MongoDB is running and accessible.
* Check logs for errors (Winster logger will display them clearly).
* If the issue persists, **contact the developer**.

---

## 🛡️ License

This project is licensed under the **[Apache License 2.0](LICENSE)** – free to use and modify.

---

## 🤝 Contributing

Contributions are welcome!
Feel free to **fork** this repository, create a feature branch, and submit a pull request.

---

## 👨‍💻 Contact

If you face any issues or have suggestions, reach out to the developer
