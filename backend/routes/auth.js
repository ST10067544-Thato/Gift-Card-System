const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const checkRole = require("../middleware/checkRole");

const router = express.Router();

// Generate JWT Token with Role Information
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" } // Token expires in 2 hours
  );
};

// Login Route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid credentials" });

      // Check password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) return res.status(400).json({ message: "Invalid credentials" });

      // Return token with role (admin or store)
      res.json({
        token: generateToken(user),
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      console.error("Login Error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Register Branch User (Restricted to Admins)
router.post(
  "/register",
  checkRole(["admin"]), // Only admin can register new users
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      if (await User.findOne({ email })) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        password: hashedPassword,
        role: "store", // Default to 'store' for new users
      });
      await newUser.save();

      res.json({ message: "Branch user registered successfully", email });
    } catch (err) {
      console.error("User Registration Error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get All Users (Admin only)
router.get("/users", checkRole(["admin"]), async (req, res) => {
  try {
    const users = await User.find().select("email role -_id"); // Only return email and role for privacy
    res.json(users);
  } catch (err) {
    console.error("User Fetch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
