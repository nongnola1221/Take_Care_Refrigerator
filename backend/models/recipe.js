const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Recipe = sequelize.define('Recipe', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  cuisine_type: {
    type: DataTypes.STRING, // '한식', '양식', '중식' 등
  },
  serving_size: {
    type: DataTypes.INTEGER,
  },
  cooking_time: {
    type: DataTypes.STRING,
  },
  difficulty: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Recipe;
