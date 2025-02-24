const express = require("express");
const dotenv = require("dotenv").config();
const app = require("./app"); // Import the app.js file where your routes and middleware are defined

// Start the server
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Self-Pinging Mechanism to Keep Render API Active During Business Hours (GMT+2)
const fetch = global.fetch || require("node-fetch");

const PING_INTERVAL = process.env.PING_INTERVAL || 5 * 60 * 1000; // Default: Every 5 minutes
const TIMEZONE_OFFSET = process.env.TIMEZONE_OFFSET || 2 * 60; // Default: GMT+2
const BUSINESS_HOURS = { 
  start: process.env.BUSINESS_HOURS_START || 8, 
  end: process.env.BUSINESS_HOURS_END || 22,
};

// ✅ Use Render’s external URL in production, otherwise use localhost
const API_URL = process.env.RENDER_EXTERNAL_URL
  ? `${process.env.RENDER_EXTERNAL_URL}/ping`
  : `http://localhost:${port}/ping`;

setInterval(async () => {
  const now = new Date();
  const gmtPlus2Hours = now.getUTCHours() + TIMEZONE_OFFSET / 60; // Convert UTC to GMT+2

  if (gmtPlus2Hours >= BUSINESS_HOURS.start && gmtPlus2Hours < BUSINESS_HOURS.end) {
    try {
      const res = await fetch(API_URL);
      console.log(`Pinged self at ${gmtPlus2Hours}:00 GMT+2: ${res.status}`);
    } catch (err) {
      console.error(`Ping failed at ${gmtPlus2Hours}:00 GMT+2:`, err.message);
    }
  } else {
    console.log(`Skipping ping, outside business hours: ${gmtPlus2Hours}:00 GMT+2`);
  }
}, PING_INTERVAL);
