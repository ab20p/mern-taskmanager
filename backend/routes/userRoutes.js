
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User exists" });

    const user = await User.create({ name, email, password });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ ...user._doc, token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

export default router;
