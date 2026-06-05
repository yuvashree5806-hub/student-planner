const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Subject = require("./Subject");

const Task = sequelize.define("Task", {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  dueDate: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.ENUM("pending", "in-progress", "completed"),
    defaultValue: "pending"
  },
  priority: {
    type: DataTypes.ENUM("low", "medium", "high"),
    defaultValue: "medium"
  }
});

// relationship
Task.belongsTo(Subject, { foreignKey: "subjectId" });

module.exports = Task;
