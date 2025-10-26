const express = require('express');
const { models } = require('../models');
const { Ingredient } = models;

const router = express.Router();

// Get all ingredients
router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
    });
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
