const express = require('express');
const authenticateToken = require('../middleware/auth');
const { models } = require('../models');
const { UserInventory, Ingredient } = models;

const router = express.Router();

// Apply authentication middleware to all routes in this file
router.use(authenticateToken);

// Get all inventory items for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const inventory = await UserInventory.findAll({
      where: { userId },
      include: [{ model: Ingredient, attributes: ['name'] }],
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new item to inventory
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { ingredientName, quantity, expiry_date } = req.body;

    // Find or create the ingredient
    const [ingredient] = await Ingredient.findOrCreate({
      where: { name: ingredientName },
    });

    const newItem = await UserInventory.create({
      userId,
      ingredientId: ingredient.id,
      quantity,
      expiry_date,
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an inventory item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, expiry_date } = req.body;
    const item = await UserInventory.findOne({ where: { id, userId: req.user.id } });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    item.quantity = quantity;
    item.expiry_date = expiry_date;
    await item.save();

    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an inventory item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await UserInventory.findOne({ where: { id, userId: req.user.id } });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await item.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
