const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Subject = sequelize.define("Subject", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: "#38bdf8"
  },
  teacher: {
    type: DataTypes.STRING
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = Subject;
