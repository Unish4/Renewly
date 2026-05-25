import express from "express";
import cors from "cors";
// import { clerkMiddleware } from "@clerk/express";
import { ENV } from "./config/env.js";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

//Routes

const app = express();
const PORT = ENV.PORT || 3000;

app.use(helmet());

//Morgan logging
if (ENV.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

//Middleware
import { errorHandler } from "./middleware/errorHandler.js";


//CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, mobile apps)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
  }),
);

// Limit JSON payload size to 10MB to prevent abuse
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Global rate limiter to prevent abuse and DDoS attacks
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP. Try again in 15 minutes.",
  },
});
app.use("/api", globalLimiter);

//Clerk middleware to handle authentication and user sessions
app.use(clerkMiddleware());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Renewly API is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Arcjet middleware to protect against bots and rate limit abusive traffic
// app.use(arcjetProtect);

//Routes

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});