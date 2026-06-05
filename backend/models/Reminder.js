const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Task = require("./Task");

const Reminder = sequelize.define("Reminder", {
  remindAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  message: {
    type: DataTypes.STRING
  }
});

// relationship
Reminder.belongsTo(Task, { foreignKey: "taskId" });

module.exports = Reminder;
