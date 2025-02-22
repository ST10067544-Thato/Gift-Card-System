const express = require("express");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const checkRole = require("../middleware/checkRole");

const router = express.Router();

// Generate JWT token with user information
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" } // Token expires in 2 hours
  );
};

const tempSecrets = {}; // Temporary storage for TOTP secrets during setup

// Setup TOTP for a user
router.post("/setup-totp", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // If TOTP is already set up, return a message
    if (user.totpSecret) {
      return res.json({ message: "TOTP is already set up", hasTotp: true });
    }

    // Generate a new TOTP secret
    const secret = speakeasy.generateSecret({ length: 20 });

    // Store the secret temporarily
    tempSecrets[email] = secret.base32;

    // Generate the QR code URL
    const otpauthUrl = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `TK Gift Card System:${email}`,
      issuer: "TK Gift Card System",
      encoding: "base32",
    });
    const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);

    // Return the QR code URL and secret
    res.json({ qrCodeUrl, secret: secret.base32, hasTotp: false });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Save TOTP secret to user's profile
router.post("/save-totp", async (req, res) => {
  const { email, secret } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Save the secret to the user's profile
    user.totpSecret = secret;
    await user.save();

    res.json({ message: "TOTP secret saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Verify TOTP code during login
router.post("/verify-totp", async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Use the saved secret or temporary secret
    const secret = user.totpSecret || tempSecrets[email];
    if (!secret) {
      return res.status(400).json({ message: "TOTP setup not initiated" });
    }

    // Verify the TOTP code
    const isValid = speakeasy.totp.verify({
      secret: secret,
      encoding: "base32",
      token: code,
      window: 1, // Allow slight time variations
    });

    if (!isValid) return res.status(400).json({ message: "Invalid TOTP code" });

    // Save the secret if it was temporary
    if (!user.totpSecret) {
      user.totpSecret = secret;
      await user.save();
      delete tempSecrets[email]; // Clear the temporary secret
    }

    // Return token after successful verification
    const token = generateToken(user);
    res.json({ token, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login route with email and password validation
router.post("/login", [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Return token with role
    res.json({
      token: generateToken(user),
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Register a new user (admin only)
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

      // Hash password and create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        password: hashedPassword,
        role: "store", // Default to 'store' for new users
      });
      await newUser.save();

      res.json({ message: "Branch user registered successfully", email });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get all users (admin only)
router.get("/users", checkRole(["admin"]), async (req, res) => {
  try {
    const users = await User.find().select("email role -_id"); // Only return email and role
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;