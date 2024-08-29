const Sequelize = require("sequelize");

const sequelize = require("../util/DataBase");

const User = sequelize.define("User", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  UserName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  PhoneNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Location: {
    type: Sequelize.STRING,
  },
  CareerGoals: {
    type: Sequelize.STRING,
  },
  JobPreferences: {
    type: Sequelize.STRING,
  },
  Skills: {
    type: Sequelize.STRING,
  },
  EducationalBackground: {
    type: Sequelize.STRING,
  },
});

module.exports = User;
