const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecipeIngredient = sequelize.define('RecipeIngredient', {
  quantity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = RecipeIngredient;
