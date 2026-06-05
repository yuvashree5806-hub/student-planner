const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Subject = require("./Subject");

const Timetable = sequelize.define("Timetable", {
  day: {
    type: DataTypes.ENUM("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"),
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  room: {
    type: DataTypes.STRING
  }
});

// relationship
Timetable.belongsTo(Subject, { foreignKey: "subjectId" });

module.exports = Timetable;
