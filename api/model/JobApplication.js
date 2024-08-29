const Sequelize = require("sequelize");

const sequelize = require("../util/DataBase");

const JobApplication = sequelize.define("JobApplication", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  CompanyName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  JobTitle: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Date: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ContactDetails: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  CompanySize: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  industry: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Resume: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Notes: {
    type: Sequelize.STRING,
  },
});

module.exports = JobApplication;
