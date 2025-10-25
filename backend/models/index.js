const sequelize = require('../config/database');
const User = require('./user');
const Ingredient = require('./ingredient');
const UserInventory = require('./userInventory');
const Recipe = require('./recipe');
const RecipeIngredient = require('./recipeIngredient');
const RecommendationLog = require('./recommendationLog');

// User - UserInventory
User.hasMany(UserInventory, { foreignKey: 'userId' });
UserInventory.belongsTo(User, { foreignKey: 'userId' });

// Ingredient - UserInventory
Ingredient.hasMany(UserInventory, { foreignKey: 'ingredientId' });
UserInventory.belongsTo(Ingredient, { foreignKey: 'ingredientId' });

// Recipe - Ingredient (Many-to-Many)
Recipe.belongsToMany(Ingredient, { through: RecipeIngredient, foreignKey: 'recipeId' });
Ingredient.belongsToMany(Recipe, { through: RecipeIngredient, foreignKey: 'ingredientId' });

// User - RecommendationLog
User.hasMany(RecommendationLog, { foreignKey: 'userId' });
RecommendationLog.belongsTo(User, { foreignKey: 'userId' });

// Recipe - RecommendationLog
Recipe.hasMany(RecommendationLog, { foreignKey: 'recipeId' });
RecommendationLog.belongsTo(Recipe, { foreignKey: 'recipeId' });

const models = {
  User,
  Ingredient,
  UserInventory,
  Recipe,
  RecipeIngredient,
  RecommendationLog,
};

module.exports = { sequelize, models };
