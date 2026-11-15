import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { FileStore } from "../models/fallbackStore.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fieldshift_secret_key_2026";

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields (name, email, password)" });
    }

    const isDbConnected = mongoose.connection.readyState === 1;
    let existingUser = null;

    if (isDbConnected) {
      existingUser = await User.findOne({ email });
    } else {
      existingUser = FileStore.findUserByEmail(email);
    }

    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let userObj = null;
    if (isDbConnected) {
      const user = new User({
        name,
        email,
        password: hashedPassword,
      });
      await user.save();
      userObj = { id: user._id.toString(), name: user.name, email: user.email };
    } else {
      const user = FileStore.createUser({
        name,
        email,
        password: hashedPassword,
      });
      userObj = { id: user._id, name: user.name, email: user.email };
    }

    const token = jwt.sign(
      { id: userObj.id, email: userObj.email, name: userObj.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: userObj,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password" });
    }

    const isDbConnected = mongoose.connection.readyState === 1;
    let user = null;

    if (isDbConnected) {
      user = await User.findOne({ email });
    } else {
      user = FileStore.findUserByEmail(email);
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const userId = user._id ? user._id.toString() : user.id;

    const token = jwt.sign(
      { id: userId, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Current User Profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let user = null;

    if (isDbConnected) {
      user = await User.findById(req.user.id).select("-password");
    } else {
      const rawUser = FileStore.findUserById(req.user.id);
      if (rawUser) {
        const { password, ...safeUser } = rawUser;
        user = safeUser;
      }
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
