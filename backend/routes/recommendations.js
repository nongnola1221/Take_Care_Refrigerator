const express = require('express');
const { TfIdf } = require('natural');
const { models } = require('../models');
const { Recipe, Ingredient, UserInventory } = models;

const router = express.Router();

// Cosine similarity function for sparse vectors (represented as objects)
function cosineSimilarity(vecA, vecB) {
  const terms = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const term of terms) {
    const valA = vecA[term] || 0;
    const valB = vecB[term] || 0;
    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

router.post('/', async (req, res) => {
  try {
    const userId = 1; // Hardcoded for now
    const { cuisine_type, serving_size } = req.body;

    // 1. Fetch user's inventory and all recipes
    const userInventoryItems = await UserInventory.findAll({
      where: { userId },
      include: Ingredient,
    });
    const userIngredients = userInventoryItems.map(item => item.Ingredient.name);

    if (userIngredients.length === 0) {
      return res.json([]); // Return empty array if inventory is empty
    }

    const allRecipes = await Recipe.findAll({ include: Ingredient });

    // 2. Calculate similarity for each recipe
    const recommendations = [];
    for (const recipe of allRecipes) {
      const recipeIngredients = recipe.Ingredients.map(ing => ing.name);

      // Create a temporary TF-IDF instance for each comparison
      const tfidf = new TfIdf();
      tfidf.addDocument(userIngredients.join(' '));
      tfidf.addDocument(recipeIngredients.join(' '));

      // Get term scores for user inventory (doc 0)
      const userVector = {};
      tfidf.listTerms(0).forEach(term => {
        userVector[term.term] = term.tfidf;
      });

      // Get term scores for recipe (doc 1)
      const recipeVector = {};
      tfidf.listTerms(1).forEach(term => {
        recipeVector[term.term] = term.tfidf;
      });

      const similarity = cosineSimilarity(userVector, recipeVector);

      if (similarity > 0.1) { // Set a threshold to avoid very low matches
        recommendations.push({ recipe, score: similarity });
      }
    }

    // 3. Sort by similarity score
    recommendations.sort((a, b) => b.score - a.score);

    // 4. Apply filters
    let filteredRecommendations = recommendations.map(r => r.recipe);

    if (cuisine_type) {
      filteredRecommendations = filteredRecommendations.filter(r => r.cuisine_type === cuisine_type);
    }
    if (serving_size) {
      // Assuming serving_size filter means at most the specified size
      filteredRecommendations = filteredRecommendations.filter(r => r.serving_size <= serving_size);
    }

    // 5. Check if there are enough ingredients
    const finalRecommendations = filteredRecommendations.filter(recipe => {
        const recipeIngredients = recipe.Ingredients.map(ing => ing.name);
        return recipeIngredients.every(ing => userIngredients.includes(ing));
    });

    if (finalRecommendations.length === 0) {
        return res.json({ message: '식료품이 부족해요!' });
    }

    res.json(finalRecommendations);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;