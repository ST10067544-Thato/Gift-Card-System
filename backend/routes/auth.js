// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Simulate an admin email
const ADMIN_EMAILS = ["admin@toykingdom.co.za"]; 

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const isAdmin = ADMIN_EMAILS.includes(email); // Check if user is admin

    const token = jwt.sign(
      { userId: user._id, email: user.email, isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, email: user.email, isAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// TEMPORARY: Allow first-time admin registration without a token
router.post("/register-admin", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "User already exists" });
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const user = new User({
        email,
        password: hashedPassword,
      });
  
      await user.save();
  
      res.json({ message: "Admin user registered successfully", email: user.email });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Middleware to verify admin token
  const verifyAdmin = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Access denied. No token provided." });
    }
  
    const token = authHeader.split(" ")[1]; // Extract token after "Bearer "
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (!decoded.isAdmin) {
        return res.status(403).json({ message: "Access denied. Admin only." });
      }
  
      req.user = decoded; // Attach user info to request
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
  
  // Secure Register Route
  router.post("/register", verifyAdmin, async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "User already exists" });
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const user = new User({ email, password: hashedPassword });
      await user.save();
  
      res.json({ message: "Branch user registered successfully", email: user.email });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });  

// Optional route: Get all users (for admin)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("email -_id"); // Return only email field without _id
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
