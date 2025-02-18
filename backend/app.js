const express = require('express');
const app = express();
const cors = require('cors');
const { connectDB } = require('./db/config');
const authRoutes = require("./routes/auth");

// Connect to the database
connectDB();

// CORS configuration object
const corsOptions = {
    origin: 'http://localhost:3000',  // Allow only frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
    credentials: true,  // Allow credentials (cookies)
    optionsSuccessStatus: 204  // Success status for OPTIONS requests
};

// Enable CORS with the specified options
app.use(cors(corsOptions));

// Parse JSON bodies for all incoming requests
app.use(express.json());

// Set up route handlers for authentication
app.use("/api/auth", authRoutes);

module.exports = app;
