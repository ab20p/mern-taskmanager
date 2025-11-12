import express from "express";
import Task from "../models/taskModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/tasks", protect, async (req, res) => {
  const { title, description, status } = req.body;
  const task = await Task.create({ title, description, status, createdBy: req.user._id });
  res.json(task);
});

router.get("/tasks", protect, async (req, res) => {
  const tasks = await Task.find({ createdBy: req.user._id });
  res.json(tasks);
});

router.put("/tasks/:id", protect, async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete("/tasks/:id", protect,  async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

export default router;