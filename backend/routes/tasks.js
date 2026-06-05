const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Subject = require("../models/Subject");

// Get all tasks
router.get("/", async (req, res) => {
  const tasks = await Task.findAll({ include: Subject });
  res.json(tasks);
});

// Add task
router.post("/", async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
});

// Update task
router.put("/:id", async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).json({ message: "Not found" });

  await task.update(req.body);
  res.json(task);
});

// Delete task
router.delete("/:id", async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).json({ message: "Not found" });

  await task.destroy();
  res.json({ message: "Task deleted" });
});

module.exports = router;
