const express = require("express");
const router = express.Router();
const Timetable = require("../models/Timetable");
const Subject = require("../models/Subject");

// Get all timetable entries
router.get("/", async (req, res) => {
  const entries = await Timetable.findAll({ include: Subject });
  res.json(entries);
});

// Add entry
router.post("/", async (req, res) => {
  const entry = await Timetable.create(req.body);
  res.json(entry);
});

// Update entry
router.put("/:id", async (req, res) => {
  const entry = await Timetable.findByPk(req.params.id);
  if (!entry) return res.status(404).json({ message: "Not found" });

  await entry.update(req.body);
  res.json(entry);
});

// Delete entry
router.delete("/:id", async (req, res) => {
  const entry = await Timetable.findByPk(req.params.id);
  if (!entry) return res.status(404).json({ message: "Not found" });

  await entry.destroy();
  res.json({ message: "Timetable entry deleted" });
});

module.exports = router;
