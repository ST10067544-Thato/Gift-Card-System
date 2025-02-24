const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const { connectDB } = require("./db/config");
const authRoutes = require("./routes/auth");
require("dotenv").config(); // Load environment variables

// Tell Express to trust Render's proxy
app.set("trust proxy", 1);

// connect to database
connectDB();

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-user-id"],
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

// Optional: Exclude self-pings from rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests from this IP, please try again later.",
});
app.use((req, res, next) => {
    if (req.path === "/ping") return next(); // Bypass rate limiting for self-ping
    limiter(req, res, next);
});

// JSON parsing middleware
app.use(express.json());

// ✅ Optional: Add a /ping route for self-pinging
app.get("/ping", (req, res) => {
    res.status(200).send("Ping successful");
});

// Authentication routes
app.use("/api/auth", authRoutes);

module.exports = app;
