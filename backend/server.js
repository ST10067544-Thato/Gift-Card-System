const express = require("express");
const dotenv = require('dotenv').config()
const app = require("./app");  // Import the app.js file where your routes and middleware are defined

// Start the server
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
