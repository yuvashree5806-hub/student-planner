const express = require("express");
const router = express.Router();
const Reminder = require("../models/Reminder");
const Task = require("../models/Task");

// Get all reminders
router.get("/", async (req, res) => {
  const reminders = await Reminder.findAll({ include: Task });
  res.json(reminders);
});

// Add reminder
router.post("/", async (req, res) => {
  const reminder = await Reminder.create(req.body);
  res.json(reminder);
});

// Update reminder
router.put("/:id", async (req, res) => {
  const reminder = await Reminder.findByPk(req.params.id);
  if (!reminder) return res.status(404).json({ message: "Not found" });

  await reminder.update(req.body);
  res.json(reminder);
});

// Delete reminder
router.delete("/:id", async (req, res) => {
  const reminder = await Reminder.findByPk(req.params.id);
  if (!reminder) return res.status(404).json({ message: "Not found" });

  await reminder.destroy();
  res.json({ message: "Reminder deleted" });
});

module.exports = router;
