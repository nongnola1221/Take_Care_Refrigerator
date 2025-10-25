const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserInventory = sequelize.define('UserInventory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.STRING,
  },
  expiry_date: {
    type: DataTypes.DATE,
  },
});

module.exports = UserInventory;
