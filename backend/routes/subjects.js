const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");

// Get all subjects
router.get("/", async (req, res) => {
  const subjects = await Subject.findAll();
  res.json(subjects);
});

// Add a subject
router.post("/", async (req, res) => {
  const subject = await Subject.create(req.body);
  res.json(subject);
});

// Update a subject
router.put("/:id", async (req, res) => {
  const subject = await Subject.findByPk(req.params.id);
  if (!subject) return res.status(404).json({ message: "Not found" });

  await subject.update(req.body);
  res.json(subject);
});

// Delete a subject
router.delete("/:id", async (req, res) => {
  const subject = await Subject.findByPk(req.params.id);
  if (!subject) return res.status(404).json({ message: "Not found" });

  await subject.destroy();
  res.json({ message: "Subject deleted" });
});

module.exports = router;
