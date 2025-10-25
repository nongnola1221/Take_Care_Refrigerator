const express = require('express');
const { models } = require('../models');
const authenticateToken = require('../middleware/auth');
const { RecommendationLog } = models;

const router = express.Router();
router.use(authenticateToken);

// Log an action (e.g., user cooked a recipe)
router.post('/log', async (req, res) => {
  try {
    const userId = req.user.id;
    const { recipeId, action } = req.body; // action could be 'cooked', 'dismissed', etc.

    if (!recipeId || !action) {
      return res.status(400).json({ error: 'recipeId and action are required' });
    }

    const log = await RecommendationLog.create({
      userId,
      recipeId,
      action,
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
