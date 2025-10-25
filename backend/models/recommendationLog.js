const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecommendationLog = sequelize.define('RecommendationLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  action: {
    type: DataTypes.STRING, // 예: 'cooked', 'dismissed'
  },
});

module.exports = RecommendationLog;
