const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./db");

// Load models
require("./models/user");
require("./models/Subject");
require("./models/Task");
require("./models/Timetable");
require("./models/Reminder");

const app = express();
app.use(cors());
app.use(express.json());

// Register Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/subjects", require("./routes/subjects"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/timetable", require("./routes/timetable"));
app.use("/api/reminders", require("./routes/reminders"));

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Sync DB and start server
sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
    app.listen(process.env.PORT || 5000, () =>
      console.log("Server running on port", process.env.PORT || 5000)
    );
  })
  .catch((err) => console.log("Database error:", err));
