const express = require('express');
const { models } = require('../models');
const { Recipe, Ingredient } = models;

const router = express.Router();

// Get storage tips for a recipe's main ingredients
router.get('/:id/storage_tip', async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByPk(id, {
      include: {
        model: Ingredient,
        attributes: ['name', 'storage_tip'],
        through: { attributes: [] } // Don't include RecipeIngredient attributes
      },
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Define "main ingredients" as the first 3 for simplicity
    const mainIngredients = recipe.Ingredients.slice(0, 3);

    res.json(mainIngredients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
